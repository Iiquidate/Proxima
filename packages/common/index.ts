export interface User {
    id: string;
    username: string;
    role: 'member' | 'admin';
}

export interface Channel {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    createdBy: string;  // member or admin ID
    type: 'official' | 'community'; // admin defined "official" locations, or user defined channels
    visibility: 'public' | 'private'; // public channels visible to all, private only to members
}

export interface ChatMessage {
    id: string;
    channelId: string;
    userId: string;
    username?: string;
    role?: 'member' | 'admin';
    content: string;
    createdAt: string;  // date in the form of a string
}

export interface AuthUser {
  id: string;
  email?: string;
}