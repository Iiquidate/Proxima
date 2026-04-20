import pool from '../db/connection';
import { ChatMessage } from '@proxima/common';

export async function getMessagesByChannelId(channelId: string): Promise<ChatMessage[]> {
    const result = await pool.query(
        `SELECT m.id, m.channel_id AS "channelId", m.user_id AS "userId", u.username,
                m.content, m.created_at AS "createdAt"
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.channel_id = $1
        ORDER BY m.created_at ASC`,
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
        `WITH inserted AS (
            INSERT INTO messages (channel_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING id, channel_id, user_id, content, created_at
        )
        SELECT i.id, i.channel_id AS "channelId", i.user_id AS "userId", u.username,
               i.content, i.created_at AS "createdAt"
        FROM inserted i
        JOIN users u ON i.user_id = u.id`,
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