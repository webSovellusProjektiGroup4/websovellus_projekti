import { fetchPopularMovies, searchMovies } from '../services/movieService.js'

const getPopularMovies = async (req, res, next) => {
  try {
    const popularMovies = await fetchPopularMovies()

      res.status(200).json(popularMovies)

    
  } catch (error) {
    res.status(500).json({ error: 'Virhe elokuvien haussa' })
  }
}

const getSearchMovies = async (req, res, next) => {
  try {
    const query = req.query.query?.trim()

    if (!query) {
      return res.status(400).json({
        error: 'Hakusana puuttuu'
      })
    }

    const movies = await searchMovies(query)

    res.status(200).json(movies)
  } catch (error) {
    next(error)
  }
}

export { getPopularMovies, getSearchMovies }
