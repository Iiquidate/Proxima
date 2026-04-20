export const DEFAULT_RADIUS_METERS = 100;

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
}

export interface ChatMessage {
    id: string;
    channelId: string;
    userId: string;
    username?: string;
    content: string;
    createdAt: string;  // date in the form of a string
}

export interface AuthUser {
  id: string;
  email?: string;
}