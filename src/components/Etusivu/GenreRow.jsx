import { useEffect, useState } from 'react'
import axios from 'axios'
import MovieList from '../MovieList.jsx'

function GenreRow({ genreId, title }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/movies/genre/${genreId}`)
      .then((response) => setMovies(response.data.results))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [genreId])

  if (!loading && movies.length === 0) return null

  return (
    <section>
      <h2>{title}</h2>
      {loading ? <p>Ladataan...</p> : <MovieList movies={movies} mode="row" />}
    </section>
  )
}

export default GenreRow