import { Router } from 'express'
import { getPopularMovies, getMovieById } from '../controllers/MovieController.js'
import { getReviews, createReview } from '../controllers/ReviewController.js'

const router = Router()

router.get('/popular', getPopularMovies)
router.get('/:id/reviews', getReviews)
router.post('/:id/reviews', createReview)
router.get('/:id', getMovieById)

export default router
