import { fetchPopularMovies } from '../services/movieService.js'

const getPopularMovies = async (req, res, next) => {
  try {
    const popularMovies = await fetchPopularMovies()
    res.status(200).json(popularMovies)
  } catch (error) {
    res.status(500).json({ error: 'Virhe elokuvien haussa' })
  }
}

const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params
    const API_TOKEN = process.env.TMDB_API_TOKEN

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=fi-FI`,
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      }
    )

    if (!response.ok) {
      const error = new Error(`TMDB-movie query failed (${response.status})`)
      error.status = 502
      throw error
    }

    const movie = await response.json()
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json({ error: 'Virhe elokuvan haussa' })
  }
}

export { getPopularMovies, getMovieById }
