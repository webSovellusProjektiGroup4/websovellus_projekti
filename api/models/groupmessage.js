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

// Ryhmään jaetut elokuvat (group_posts) TMDB-tunnisteineen.
// comment = jakajan oma viesti, eli jakajan ensimmäinen kommentti jakoon (group_comments)
const getMoviePosts = async (groupId) => {
  const result = await pool.query(
    `SELECT group_posts.id, group_posts.user_id, group_posts.created_at,
                users.username, movies.tmdb_id,
                (SELECT group_comments.content
                 FROM group_comments
                 WHERE group_comments.post_id = group_posts.id
                   AND group_comments.user_id = group_posts.user_id
                 ORDER BY group_comments.created_at, group_comments.id
                 LIMIT 1) AS comment
         FROM group_posts
         JOIN users ON users.id = group_posts.user_id
         JOIN movies ON movies.id = group_posts.movie_id
         WHERE group_posts.group_id = $1
         ORDER BY group_posts.created_at`,
    [groupId]
  )
  return result.rows
}

// Tallentaa elokuvan movies-tauluun (jos sitä ei vielä ole), jakaa sen ryhmään
// ja tallentaa jakajan viestin (comment, voi olla null) jaon kommentiksi.
// Yksi lause, joten kaikki onnistuvat tai mikään ei.
const addMoviePost = async (groupId, userId, tmdbId, comment) => {
  const result = await pool.query(
    `WITH movie AS (
             INSERT INTO movies (tmdb_id)
             VALUES ($3)
             ON CONFLICT (tmdb_id) DO UPDATE SET tmdb_id = EXCLUDED.tmdb_id
             RETURNING id
         ),
         post AS (
             INSERT INTO group_posts (group_id, user_id, movie_id)
             SELECT $1, $2, movie.id FROM movie
             RETURNING id, user_id, created_at
         ),
         post_comment AS (
             INSERT INTO group_comments (post_id, user_id, content)
             SELECT post.id, $2, $4::text FROM post
             WHERE $4::text IS NOT NULL
             RETURNING content
         )
         SELECT post.id, post.user_id, post.created_at,
                (SELECT content FROM post_comment) AS comment
         FROM post`,
    [groupId, userId, tmdbId, comment]
  )
  return result.rows[0]
}

export { isGroupMember, getMessages, addMessage, getMoviePosts, addMoviePost }
