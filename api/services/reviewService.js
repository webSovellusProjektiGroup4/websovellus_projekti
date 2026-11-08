import { pool } from '../models/db.js'

const fetchReviews = async (tmdbId) => {
  const stats = await pool.query(
    `SELECT ROUND(AVG(r.rating), 1) AS average, COUNT(*)::int AS count
     FROM reviews r
     JOIN movies m ON m.id = r.movie_id
     WHERE m.tmdb_id = $1 AND r.visibility = 'public' AND r.group_id IS NULL`,
    [tmdbId]
  )
  return {
    average: stats.rows[0].average,
    count: stats.rows[0].count
  }
}

const addReview = async ({ userId, tmdbId, rating }) => {
  await pool.query(
    'INSERT INTO movies (tmdb_id) VALUES ($1) ON CONFLICT (tmdb_id) DO NOTHING',
    [tmdbId]
  )
  const result = await pool.query(
    `INSERT INTO reviews (user_id, movie_id, rating)
     SELECT $1::int, id, $3::int FROM movies WHERE tmdb_id = $2::int
     RETURNING id`,
    [userId, tmdbId, rating]
  )
  return result.rows[0]
}

export { fetchReviews, addReview }