import pool from '../db/connection';
import { Channel } from '@proxima/common';

export async function getChannelById(id: string): Promise<Channel | null> {
    const result = await pool.query(
        `SELECT id, name, radius_meters, created_by, created_at,
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
        `SELECT id, name, radius_meters, created_by, created_at, type,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE type = 'official'`
    );

    return result.rows as Channel[];
}

export async function getNearbyCommunityChannels(lat: number, lng: number): Promise<Channel[]> {
    const result = await pool.query(
        `SELECT id, name, radius_meters, created_by, created_at, type,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat
        FROM channels
        WHERE type = 'community'
        AND ST_DWithin(
        location,
        ST_MakePoint($1, $2)::geography,
        radius_meters
        )`,
        [lng, lat]
    );

    return result.rows as Channel[];
}

export async function createChannel(
    name: string,
    lat: number,
    lng: number,
    radiusMeters: number,
    createdBy: string,
    type: 'official' | 'community'
): Promise<Channel> {
    const result = await pool.query(
        `INSERT INTO channels (name, location, radius_meters, created_by, type)
        VALUES ($1, ST_MakePoint($2, $3)::geography, $4, $5, $6)
        RETURNING id, name, radius_meters, created_by, created_at, type,
        ST_X(location::geometry) as lng,
        ST_Y(location::geometry) as lat`,
        [name, lng, lat, radiusMeters, createdBy, type]
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

