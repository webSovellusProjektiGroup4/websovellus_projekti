import { Router } from 'express'
import { getPopularMovies, getMovieById, getSearchMovies } from '../controllers/MovieController.js'
import { getReviews, createReview } from '../controllers/ReviewController.js'

const router = Router()

router.get('/popular', getPopularMovies)
router.get('/search', getSearchMovies)
router.get('/:id/reviews', getReviews)
router.post('/:id/reviews', createReview)
router.get('/:id', getMovieById)

export default router