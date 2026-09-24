export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  city?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVenue {
  name: string;
  address?: string;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface IEvent {
  _id: string;
  source: string;
  sourceId: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  ticketUrl?: string;
  venue: IVenue;
  startTime: string;
  endTime?: string;
  timezone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRSVP {
  _id: string;
  userId: string;
  eventId: string;
  status: "confirmed" | "cancelled";
  inviteId?: string | null;
  referredByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IInviteLink {
  _id: string;
  token: string;
  eventId: string;
  ownerUserId: string;
  clickCount: number;
  uniqueClickCount: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReminder {
  _id: string;
  userId: string;
  eventId: string;
  reminderTime: string;
  status: "pending" | "sent" | "cancelled";
  createdAt: string;
}

export interface IConversation {
  _id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessage {
  _id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: any[];
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; message: string };
}
