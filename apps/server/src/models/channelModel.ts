import pool from '../db/connection';
import { Channel, User } from '@proxima/common';

export async function getChannelById(id: string): Promise<Channel | null> {
    const result = await pool.query(
        `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE id = $1`,
        [id]
        );

    if (result.rows.length === 0) return null;

    return result.rows[0] as Channel;
}

export async function getOfficialChannels(): Promise<Channel[]> {
    const result = await pool.query(
        `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE type = 'official'`
    );

    return result.rows as Channel[];
}

export async function getAllChannels(userId?: string, role?: string): Promise<Channel[]> {
    // Admins see all channels including private ones
    if (role === 'admin') {
        const result = await pool.query(
            `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
            ST_X(location::geometry) as lng,
            ST_Y(location::geometry) as lat
            FROM channels`
        );
        return result.rows as Channel[];
    }

    const result = await pool.query(
        `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE type = 'official'
           OR visibility = 'public'
           OR created_by = $1
           OR id IN (SELECT channel_id FROM channel_members WHERE user_id = $1)`,
        [userId]
    );

    return result.rows as Channel[];
}

export async function getNearbyChannels(lat: number, lng: number, userId?: string, role?: string): Promise<Channel[]> {
    // Admins see all channels including private ones
    if (role === 'admin') {
        const result = await pool.query(
            `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
            ST_X(location::geometry) as lng,
            ST_Y(location::geometry) as lat
            FROM channels
            WHERE ST_DWithin(
            location,
            ST_MakePoint($1, $2)::geography,
            radius_meters
            )`,
            [lng, lat]
        );
        return result.rows as Channel[];
    }

    const result = await pool.query(
        `SELECT id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE ST_DWithin(
        location,
        ST_MakePoint($1, $2)::geography,
        radius_meters
        )
        AND (type = 'official'
             OR visibility = 'public'
             OR created_by = $3
             OR id IN (SELECT channel_id FROM channel_members WHERE user_id = $3))`,
        [lng, lat, userId]
    );

    return result.rows as Channel[];
}

export async function createChannel(
    name: string,
    lat: number,
    lng: number,
    radiusMeters: number,
    createdBy: string,
    type: 'official' | 'community',
    visibility: 'public' | 'private' = 'public'
): Promise<Channel> {
    const result = await pool.query(
        `INSERT INTO channels (name, location, radius_meters, created_by, type, visibility)
        VALUES ($1, ST_MakePoint($2, $3)::geography, $4, $5, $6, $7)
        RETURNING id, name, radius_meters AS "radiusMeters", created_by AS "createdBy", created_at, type, visibility,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat`,
        [name, lng, lat, radiusMeters, createdBy, type, visibility]
    );

    return result.rows[0] as Channel;
}

export async function deleteChannel(id: string, userId: string): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM channels
        WHERE id = $1 AND created_by = $2`, // Added this in order to allow only the creator of the channel to delete it, this was researched through Google Gemini
        [id, userId]
    );

    return result.rowCount == 1;
}

// This is for admin deleting channels, it will not check for the creator of the channel
export async function adminDeleteChannel(id: string): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM channels
        WHERE id = $1`,
        [id]
    );

    return result.rowCount == 1;
}

// --- Channel Members ---

export async function addChannelMember(channelId: string, userId: string): Promise<void> {
    await pool.query(
        `INSERT INTO channel_members (channel_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
        [channelId, userId]
    );
}

export async function removeChannelMember(channelId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM channel_members
        WHERE channel_id = $1 AND user_id = $2`,
        [channelId, userId]
    );

    return result.rowCount === 1;
}

export async function getChannelMembers(channelId: string): Promise<User[]> {
    const result = await pool.query(
        `SELECT u.id, u.username, u.role
        FROM channel_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.channel_id = $1
        ORDER BY u.username ASC`,
        [channelId]
    );

    return result.rows as User[];
}

export async function isChannelMember(channelId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT 1 FROM channel_members
        WHERE channel_id = $1 AND user_id = $2`,
        [channelId, userId]
    );

    return result.rows.length > 0;
}

// Get all non-admin users for the "add members" list, excluding the channel owner
export async function getAllMembers(excludeUserId?: string): Promise<User[]> {
    const result = await pool.query(
        `SELECT id, username, role
        FROM users
        WHERE role != 'admin'
          AND id != $1
        ORDER BY username ASC`,
        [excludeUserId]
    );

    return result.rows as User[];
}

// Get users who have sent messages in a channel
export async function getChannelParticipants(channelId: string): Promise<User[]> {
    const result = await pool.query(
        `SELECT DISTINCT u.id, u.username, u.role
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = $1
        ORDER BY u.username ASC`,
        [channelId]
    );

    return result.rows as User[];
}
