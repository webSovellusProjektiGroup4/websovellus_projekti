import { Router } from 'express'
import { getPopularMovies } from '../controllers/MovieController.js'

const router = Router()

router.get('/popular', getPopularMovies)

export default router
