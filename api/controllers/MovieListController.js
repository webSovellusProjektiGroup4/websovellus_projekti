
import {
  createMovieList,
  getUserMovieLists,
  addMovieToList,
  getMoviesFromList,
  updateMovieList,
  deleteMovieList,
  removeMovieFromList,
  getSharedMovieList
} from '../models/MovieList.js'

import { fetchMovieDetails } from '../services/movieService.js'

// Haetaan elokuvien nimet ja julisteet TMDB:stä
const addMovieDetails = async (movies) => {
  return Promise.all(
    movies.map(async (movie) => {
      try {
        const details = await fetchMovieDetails(movie.tmdb_id)

        return {
          ...movie,
          ...details
        }
      } catch (error) {
        console.error(
          `Elokuvan ${movie.tmdb_id} tietojen haku epäonnistui:`,
          error.message
        )

        return {
          ...movie,
          title: `Elokuva ${movie.tmdb_id}`,
          poster_path: null
        }
      }
    })
  )
}

// Uuden elokuvalistan luominen
async function createMovieListController(req, res, next) {
  try {
    const name = typeof req.body?.name === 'string'
      ? req.body.name.trim()
      : ''

    const visibility = req.body?.visibility ?? 'private'

    if (!name) {
      return res.status(400).json({
        error: 'Listan nimi ei voi olla tyhjä'
      })
    }

    if (!['private', 'public', 'unlisted'].includes(visibility)) {
      return res.status(400).json({
        error: 'Virheellinen näkyvyys'
      })
    }

    const userId = req.user.id
    const list = await createMovieList(userId, name, visibility)

    return res.status(201).json({ list })
  } catch (error) {
    next(error)
  }
}

// Kirjautuneen käyttäjän listojen hakeminen
const getUserMovieListsController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const lists = await getUserMovieLists(userId)

    return res.status(200).json({ lists })
  } catch (error) {
    next(error)
  }
}

// Elokuvan lisääminen käyttäjän listalle
const addMovieToListController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const listId = Number(req.params.listId)
    const tmdbId = Number(req.body?.tmdbId)

    if (
      !Number.isSafeInteger(listId) ||
      listId <= 0 ||
      !Number.isSafeInteger(tmdbId) ||
      tmdbId <= 0
    ) {
      return res.status(400).json({
        error: 'Virheellinen listan tai elokuvan tunniste'
      })
    }

    const result = await addMovieToList(userId, listId, tmdbId)

    if (!result) {
      return res.status(404).json({
        error: 'Elokuvalistaa ei löytynyt'
      })
    }

    if (result.alreadyExists) {
      return res.status(409).json({
        error: 'Elokuva on jo tällä listalla'
      })
    }

    return res.status(201).json({
      message: 'Elokuva lisätty listalle',
      item: result.item
    })
  } catch (error) {
    next(error)
  }
}

// Oman elokuvalistan elokuvien hakeminen
const getMoviesFromListController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const listId = Number(req.params.listId)

    if (!Number.isSafeInteger(listId) || listId <= 0) {
      return res.status(400).json({
        error: 'Virheellinen listan tunniste'
      })
    }

    const result = await getMoviesFromList(userId, listId)

    if (!result) {
      return res.status(404).json({
        error: 'Elokuvalistaa ei löytynyt'
      })
    }

    const movies = await addMovieDetails(result.movies)

    return res.status(200).json({
      ...result,
      movies
    })
  } catch (error) {
    next(error)
  }
}

// Listan nimen ja näkyvyyden muokkaaminen
const updateMovieListController = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId)
    const { name, visibility } = req.body || {}

    if (!Number.isSafeInteger(listId) || listId <= 0) {
      return res.status(400).json({
        error: 'Virheellinen listan tunniste'
      })
    }

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'Listan nimi vaaditaan'
      })
    }

    if (!['private', 'public', 'unlisted'].includes(visibility)) {
      return res.status(400).json({
        error: 'Virheellinen näkyvyys'
      })
    }

    const list = await updateMovieList(
      req.user.id,
      listId,
      name.trim(),
      visibility
    )

    if (!list) {
      return res.status(404).json({
        error: 'Listaa ei löytynyt'
      })
    }

    return res.status(200).json({ list })
  } catch (error) {
    next(error)
  }
}

// Kokonaisen elokuvalistan poistaminen
const deleteMovieListController = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId)

    if (!Number.isSafeInteger(listId) || listId <= 0) {
      return res.status(400).json({
        error: 'Virheellinen listan tunniste'
      })
    }

    const deleted = await deleteMovieList(req.user.id, listId)

    if (!deleted) {
      return res.status(404).json({
        error: 'Listaa ei löytynyt'
      })
    }

    return res.status(200).json({
      message: 'Lista poistettu'
    })
  } catch (error) {
    next(error)
  }
}

// Yksittäisen elokuvan poistaminen listalta
const removeMovieFromListController = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId)
    const tmdbId = Number(req.params.tmdbId)

    if (
      !Number.isSafeInteger(listId) ||
      listId <= 0 ||
      !Number.isSafeInteger(tmdbId) ||
      tmdbId <= 0
    ) {
      return res.status(400).json({
        error: 'Virheellinen tunniste'
      })
    }

    const result = await removeMovieFromList(
      req.user.id,
      listId,
      tmdbId
    )

    if (!result) {
      return res.status(404).json({
        error: 'Listaa ei löytynyt'
      })
    }

    if (!result.removed) {
      return res.status(404).json({
        error: 'Elokuvaa ei löytynyt listalta'
      })
    }

    return res.status(200).json({
      message: 'Elokuva poistettu listalta'
    })
  } catch (error) {
    next(error)
  }
}

// Jaetun elokuvalistan hakeminen ilman kirjautumista
const getSharedMovieListController = async (req, res, next) => {
  try {
    const listId = Number(req.params.listId)

    if (!Number.isSafeInteger(listId) || listId <= 0) {
      return res.status(400).json({
        error: 'Virheellinen listan tunniste'
      })
    }

    const result = await getSharedMovieList(listId)

    if (!result) {
      return res.status(404).json({
        error: 'Jaettua elokuvalistaa ei löytynyt'
      })
    }

    const movies = await addMovieDetails(result.movies)

    return res.status(200).json({
      ...result,
      movies
    })
  } catch (error) {
    next(error)
  }
}

export {
  createMovieListController,
  getUserMovieListsController,
  addMovieToListController,
  getMoviesFromListController,
  updateMovieListController,
  deleteMovieListController,
  removeMovieFromListController,
  getSharedMovieListController
}
