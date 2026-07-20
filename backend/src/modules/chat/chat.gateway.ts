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
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../services/notification.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        client.disconnect();
        return;
      }
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub as string;

      client.data.userId = userId;
      this.onlineUsers.set(userId, client.id);
      client.join(`user:${userId}`);

      this.server.emit('user-online', { userId });

      const unreadCount = await this.prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });
      client.emit('unread-count', { count: unreadCount });
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string | undefined;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('user-offline', { userId });
    }
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { bookingId: string; message: string; attachment?: string; receiverId?: string },
  ) {
    const senderId = client.data.userId as string;
    if (!senderId || !data?.bookingId || !data?.message?.trim()) {
      return { success: false, error: 'bookingId and message are required' };
    }

    try {
      const { receiverId } = await this.chatService.resolveCounterpart(
        data.bookingId,
        senderId,
      );

      const savedMessage = await this.prisma.message.create({
        data: {
          bookingId: data.bookingId,
          senderId,
          receiverId,
          message: data.message.trim(),
          attachmentUrl: data.attachment,
          isRead: false,
        },
      });

      client.emit('message-sent', savedMessage);

      const receiverSocketId = this.onlineUsers.get(receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new-message', savedMessage);
      } else {
        try {
          await this.notificationService.sendPushNotification({
            userId: receiverId,
            title: 'New Message',
            body: 'You have a new message about a booking',
            data: {
              bookingId: data.bookingId,
              messageId: savedMessage.id,
            },
          });
        } catch (err) {
          this.logger.warn(
            `Push notification failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }

      return { success: true, message: savedMessage };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      return { success: false, error: message };
    }
  }

  @SubscribeMessage('mark-read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    const userId = client.data.userId as string;

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
    @MessageBody() data: { bookingId: string; page?: number; limit?: number },
  ) {
    const userId = client.data.userId as string;
    try {
      const history = await this.chatService.getHistory({
        userId,
        bookingId: data.bookingId,
        page: data.page || 1,
        limit: data.limit || 50,
      });
      client.emit('chat-history', history);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load history';
      return { success: false, error: message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string; isTyping: boolean; receiverId?: string },
  ) {
    const senderId = client.data.userId as string;
    if (!data?.bookingId) return;

    try {
      const { receiverId } = await this.chatService.resolveCounterpart(
        data.bookingId,
        senderId,
      );
      const receiverSocketId = this.onlineUsers.get(receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('typing-status', {
          bookingId: data.bookingId,
          senderId,
          isTyping: Boolean(data.isTyping),
        });
      }
    } catch {
      // ignore typing errors for unauthorized clients
    }
  }
}
