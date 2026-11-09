import { pool } from '../models/db.js'

const fetchReviews = async (tmdbId, userId) => {
  const stats = await pool.query(
    `SELECT ROUND(AVG(r.rating), 1) AS average, COUNT(*)::int AS count
     FROM reviews r
     JOIN movies m ON m.id = r.movie_id
     WHERE m.tmdb_id = $1 AND r.visibility = 'public' AND r.group_id IS NULL`,
    [tmdbId]
  )
  let myRating = null
  if (userId){
    const mine = await pool.query(
    `SELECT r.rating
    FROM reviews r
    JOIN movies m ON m.id = r.movie_id
    WHERE m.tmdb_id = $1 AND r.user_id = $2 AND r.group_id IS NULL
    `,
    [tmdbId, userId]
  )
  myRating = mine.rows[0]?.rating ?? null 
  }
  return {
    average: stats.rows[0].average,
    count: stats.rows[0].count,
    myRating: myRating
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
      ON CONFLICT (user_id, movie_id, group_id) DO UPDATE SET rating = EXCLUDED.rating
      RETURNING id`,
    [userId, tmdbId, rating]
  )
  return result.rows[0]
}

export { fetchReviews, addReview }