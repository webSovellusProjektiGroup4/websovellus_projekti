import { Router } from 'express'
import { getPopularMovies, getMovieById, getSearchMovies } from '../controllers/MovieController.js'
import { getReviews, createReview } from '../controllers/ReviewController.js'
import requireAuth from '../middleware/requireAuth.js'
import optionalAuth from '../middleware/optionalAuth.js'

const router = Router()

router.get('/popular', getPopularMovies)
router.get('/search', getSearchMovies)
router.get('/:id/reviews', optionalAuth, getReviews)
router.post('/:id/reviews', requireAuth, createReview)
router.get('/:id', getMovieById)

export default router