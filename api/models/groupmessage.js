import { pool } from './db.js'

const isGroupMember = async (groupId, userId) => {
    const result = await pool.query(
        'SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
    )
    return result.rows.length > 0
}

const getMessages = async (groupId) => {
    const result = await pool.query(
        `SELECT group_messages.*, users.username
         FROM group_messages
         JOIN users ON users.id = group_messages.user_id
         WHERE group_id = $1
         ORDER BY created_at`,
        [groupId]
    )
    return result.rows
}

const addMessage = async (groupId, userId, content) => {
    const result = await pool.query(
        'INSERT INTO group_messages (group_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [groupId, userId, content]
    )
    return result.rows[0]
}

export { isGroupMember, getMessages, addMessage }