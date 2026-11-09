import { pool } from './db.js'

const createUser = async (username, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING username, id',
        [username, passwordHash]
    )
    return result.rows[0]   
}

const findUserByUsername = async (username) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    )
    return result.rows[0]   
}

const findUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, username FROM users WHERE id = $1',
        [id]
    )
    return result.rows[0]   
}

export {createUser, findUserByUsername, findUserById}