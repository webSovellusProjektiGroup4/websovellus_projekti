import { fetchReviews, addReview } from '../services/reviewService.js'

// TODO: vaihda req.user.id:ksi, kun kirjautuminen ja requireAuth ovat valmiit
const TEMP_USER_ID = 1

const getReviews = async (req, res, next) => {
  try {
    const data = await fetchReviews(Number(req.params.id))
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

const createReview = async (req, res, next) => {
  try {
    const tmdbId = Number(req.params.id)
    const rating = Number(req.body.rating)

    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      return res.status(400).json({ error: 'Virheellinen elokuvan tunnus' })
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Arvosanan pitää olla 1-5' })
    }

    const review = await addReview({ userId: TEMP_USER_ID, tmdbId, rating })
    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export { getReviews, createReview }