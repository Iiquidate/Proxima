import pool from '../db/connection';
import { ChatMessage } from '@proxima/common';

export async function getMessagesByChannelId(channelId: string): Promise<ChatMessage[]> {
    const result = await pool.query(
        `SELECT id, channel_id AS "channelId", user_id AS "userId", content, created_at AS "createdAt"
        FROM messages
        WHERE channel_id = $1
        ORDER BY created_at ASC`,
        [channelId]
    );

    return result.rows as ChatMessage[];
}

export async function createMessage(
    channelId: string,
    userId: string,
    content: string
): Promise<ChatMessage> {
    const result = await pool.query(
        `INSERT INTO messages (channel_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, channel_id AS "channelId", user_id AS "userId", content, created_at AS "createdAt"`,
        [channelId, userId, content]
    );

    return result.rows[0] as ChatMessage;
}

export async function deleteMessage(messageId: string): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM messages
        WHERE id = $1`,
        [messageId]
    );

    return result.rowCount === 1;
}

export async function purgeOldMessages(hours: number): Promise<number> {
    const result = await pool.query(
        `DELETE FROM messages
        WHERE created_at < NOW() - INTERVAL '1 hour' * $1`,
        [hours]
    );

    return result.rowCount ?? 0;
}