
import { Router } from 'express'
import {
  createMovieListController,
  getUserMovieListsController,
  addMovieToListController,
  getMoviesFromListController,
  updateMovieListController,
  deleteMovieListController,
  removeMovieFromListController,
  getSharedMovieListController
} from '../controllers/MovieListController.js'

import requireAuth from '../middleware/requireAuth.js'

const router = Router()

// Jaetun listan katselu ilman kirjautumista
router.get('/shared/:listId', getSharedMovieListController)

// Oman listan luominen ja hakeminen
router.post('/', requireAuth, createMovieListController)
router.get('/', requireAuth, getUserMovieListsController)

// Elokuvien lisääminen ja hakeminen
router.post('/:listId/movies', requireAuth, addMovieToListController)
router.get('/:listId/movies', requireAuth, getMoviesFromListController)

// Listan muokkaaminen ja poistaminen
router.put('/:listId', requireAuth, updateMovieListController)
router.delete('/:listId', requireAuth, deleteMovieListController)

// Elokuvan poistaminen listalta
router.delete(
  '/:listId/movies/:tmdbId',
  requireAuth,
  removeMovieFromListController
)

export default router
