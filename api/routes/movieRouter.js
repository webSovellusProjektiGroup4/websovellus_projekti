import { Router } from 'express'
import { getPopularMovies, getSearchMovies } from '../controllers/MovieController.js'

const router = Router()

router.get('/popular', getPopularMovies)
router.get('/search', getSearchMovies)

export default router
