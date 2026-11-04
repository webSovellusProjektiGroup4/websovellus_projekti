import { fetchPopularMovies } from '../services/movieService.js'

const getPopularMovies = async (req, res, next) => {
  try {
    const popularMovies = await fetchPopularMovies()

      res.status(200).json(popularMovies)

    
  } catch (error) {
    res.status(500).json({ error: 'Virhe elokuvien haussa' })
  }
}

export { getPopularMovies }
