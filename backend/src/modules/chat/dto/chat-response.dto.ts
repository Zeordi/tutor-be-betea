export class ChatMessageDto {
  id!: string;
  bookingId!: string;
  senderId!: string;
  receiverId!: string;
  message!: string;
  createdAt!: string;
  isRead!: boolean;
}
