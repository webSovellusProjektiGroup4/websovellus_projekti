
import { pool } from './db.js'

// Tallentaa uuden elokuvalistan tietokantaan
const createMovieList = async (userId, name, visibility) => {
  const result = await pool.query(
    `INSERT INTO movie_lists (user_id, name, visibility)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, name, visibility, created_at`,
    [userId, name, visibility]
  )

  return result.rows[0]
}

const getUserMovieLists = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, name, visibility, created_at
     FROM movie_lists
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC`,
    [userId]
  )

  return result.rows
}

const addMovieToList = async (userId, listId, tmdbId) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Tarkistetaan, että lista kuuluu käyttäjälle
    const listResult = await client.query(
      `SELECT id FROM movie_lists
       WHERE id = $1 AND user_id = $2`,
      [listId, userId]
    )

    if (listResult.rows.length === 0) {
      await client.query('ROLLBACK')
      return null
    }

    // Tallennetaan TMDB-elokuva, jos sitä ei vielä ole
    const movieResult = await client.query(
      `INSERT INTO movies (tmdb_id)
       VALUES ($1)
       ON CONFLICT (tmdb_id)
       DO UPDATE SET tmdb_id = EXCLUDED.tmdb_id
       RETURNING id`,
      [tmdbId]
    )

    const movieId = movieResult.rows[0].id

    // Lisätään elokuva käyttäjän listalle
    const itemResult = await client.query(
      `INSERT INTO list_items (list_id, movie_id)
       VALUES ($1, $2)
       ON CONFLICT (list_id, movie_id) DO NOTHING
       RETURNING id, list_id, movie_id, added_at`,
      [listId, movieId]
    )

    await client.query('COMMIT')

    return {
      alreadyExists: itemResult.rows.length === 0,
      item: itemResult.rows[0] ?? null
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}


const getMoviesFromList = async (userId, listId) => {
  // Tarkistetaan ensin, että lista kuuluu käyttäjälle
  const listResult = await pool.query(
    `SELECT id, name
     FROM movie_lists
     WHERE id = $1 AND user_id = $2`,
    [listId, userId]
  )

  if (listResult.rows.length === 0) {
    return null
  }

  // Haetaan listaan lisättyjen elokuvien TMDB-tunnisteet
  const moviesResult = await pool.query(
    `SELECT m.tmdb_id, li.added_at
     FROM list_items li
     JOIN movies m ON m.id = li.movie_id
     WHERE li.list_id = $1
     ORDER BY li.added_at DESC, li.id DESC`,
    [listId]
  )

  return {
    list: listResult.rows[0],
    movies: moviesResult.rows
  }
}

const updateMovieList = async (userId, listId, name, visibility) => {
  const result = await pool.query(
    `UPDATE movie_lists
     SET name = $1, visibility = $2
     WHERE id = $3 AND user_id = $4
     RETURNING id, name, visibility, created_at`,
    [name, visibility, listId, userId]
  )

  return result.rows[0] || null
}

const deleteMovieList = async (userId, listId) => {
  const result = await pool.query(
    `DELETE FROM movie_lists
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [listId, userId]
  )

  return result.rows[0] || null
}

const removeMovieFromList = async (userId, listId, tmdbId) => {
  const listResult = await pool.query(
    `SELECT id
     FROM movie_lists
     WHERE id = $1 AND user_id = $2`,
    [listId, userId]
  )

  if (listResult.rows.length === 0) {
    return null
  }

  const result = await pool.query(
    `DELETE FROM list_items
     WHERE list_id = $1
       AND movie_id IN (
         SELECT id FROM movies WHERE tmdb_id = $2
       )
     RETURNING id`,
    [listId, tmdbId]
  )

  return { removed: result.rowCount > 0 }
}

const getSharedMovieList = async (listId) => {
  // Vain julkiset ja linkillä jaettavat listat ovat nähtävissä
  const listResult = await pool.query(
    `SELECT ml.id, ml.name, ml.visibility, ml.created_at,
            u.username AS owner
     FROM movie_lists ml
     JOIN users u ON u.id = ml.user_id
     WHERE ml.id = $1
       AND ml.visibility IN ('public', 'unlisted')`,
    [listId]
  )

  if (listResult.rows.length === 0) {
    return null
  }

  // Haetaan jaetun listan elokuvat
  const moviesResult = await pool.query(
    `SELECT m.tmdb_id, li.added_at
     FROM list_items li
     JOIN movies m ON m.id = li.movie_id
     WHERE li.list_id = $1
     ORDER BY li.added_at DESC, li.id DESC`,
    [listId]
  )

  return {
    list: listResult.rows[0],
    movies: moviesResult.rows
  }
}



export {
  createMovieList,
  getUserMovieLists,
  addMovieToList,
  getMoviesFromList,
  updateMovieList,
  deleteMovieList,
  removeMovieFromList,
  getSharedMovieList
}