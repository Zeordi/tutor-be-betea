// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../services/notification.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      client.data.userId = userId;
      this.onlineUsers.set(userId, client.id);

      // Join user's private room
      client.join(`user:${userId}`);

      // Notify others
      this.server.emit('user-online', { userId });

      // Send unread messages count
      const unreadCount = await this.prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });
      client.emit('unread-count', { count: unreadCount });

      console.log(`User ${userId} connected`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('user-offline', { userId });
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string; receiverId: string; message: string; attachment?: string },
  ) {
    const senderId = client.data.userId;

    // Save message to database
    const savedMessage = await this.prisma.message.create({
      data: {
        bookingId: data.bookingId,
        senderId,
        receiverId: data.receiverId,
        message: data.message,
        attachmentUrl: data.attachment,
        isRead: false,
      },
    });

    // Send to sender (confirmation)
    client.emit('message-sent', savedMessage);

    // Send to receiver if online
    const receiverSocketId = this.onlineUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('new-message', savedMessage);
    } else {
      // Send push notification if offline
      await this.notificationService.sendPushNotification({
        userId: data.receiverId,
        title: 'New Message',
        body: `You have a new message from a teacher/parent`,
        data: {
          bookingId: data.bookingId,
          messageId: savedMessage.id,
        },
      });
    }

    return { success: true, message: savedMessage };
  }

  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = client.data.userId;

    const message = await this.prisma.message.findUnique({
      where: { id: data.messageId },
    });

    if (!message || message.receiverId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: data.messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    client.emit('message-read', { messageId: data.messageId });

    // Notify sender
    const senderSocketId = this.onlineUsers.get(message.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('message-read-confirmation', {
        messageId: data.messageId,
      });
    }

    return { success: true, message: updatedMessage };
  }

  @SubscribeMessage('get-chat-history')
  async handleGetChatHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string; page: number; limit: number },
  ) {
    const userId = client.data.userId;

    const messages = await this.prisma.message.findMany({
      where: {
        bookingId: data.bookingId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip: (data.page - 1) * data.limit,
      take: data.limit,
    });

    const total = await this.prisma.message.count({
      where: {
        bookingId: data.bookingId,
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        bookingId: data.bookingId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    client.emit('chat-history', {
      messages: messages.reverse(),
      total,
      page: data.page,
      totalPages: Math.ceil(total / data.limit),
    });
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; isTyping: boolean },
  ) {
    const senderId = client.data.userId;
    const receiverSocketId = this.onlineUsers.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('typing-status', {
        senderId,
        isTyping: data.isTyping,
      });
    }
  }
}
