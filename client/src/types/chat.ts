// Frontend Chat Types - Separate from backend models
export interface ChatUser {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  sender: ChatUser;
  content: string; // Simple string for text messages
  mediaType?: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: Array<{
    user: string;
    emoji: string;
    createdAt: Date;
  }>;
  replyTo?: string;
  isEdited?: boolean;
  editedAt?: Date;
}

export interface ChatCall {
  _id: string;
  conversationId: string;
  caller: ChatUser;
  receiver: ChatUser;
  type: 'audio' | 'video';
  status: 'incoming' | 'ongoing' | 'ended' | 'missed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface ChatConversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned?: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockChatData {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  calls: ChatCall[];
} 