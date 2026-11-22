import { useState, useEffect } from 'react'
import axios from 'axios'
import './Homepage.css'
import MovieList from '../components/MovieList.jsx'
import MovieSearch from '../components/MovieSearch.jsx'
import { useAuth } from '../providers/AuthProvider.jsx'
import GroupsButton from '../components/GroupsButton.jsx'
import { Button } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GenreRow from '../components/Etusivu/GenreRow.jsx'

const GENRES = [
  { id: 27, name: 'Kauhu' },
  { id: 35, name: 'Komedia' },
  { id: 10749, name: 'Romantiikka' },
  { id: 28, name: 'Toiminta' },
  { id: 16, name: 'Animaatio' },
  { id: 878, name: 'Scifi' },
  { id: 53, name: 'Jännitys' },
  { id: 18, name: 'Draama' }
]

function Homepage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [movieListMode, setMovieListMode] = useState('row')
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') ?? ''

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      let response
      if (searchQuery) {
        response = await axios.get('/api/movies/search', { params: { query: searchQuery } })
        setMovieListMode('table')
      } else {
        response = await axios.get('/api/movies/popular')
        setMovieListMode('row')       // tai mitä suosituille halutaan
      }
      setMovies(response.data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchQuery])

  return (
    <>

      <h2>
        {searchQuery
          ? `Hakutulokset: ${searchQuery}`
          : 'Suositut elokuvat'}
      </h2>

      {loading && <p>Loading...</p>}

      {!loading && !error && movies.length === 0 && (
        <p>Elokuvia ei löytynyt.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieList movies={movies} mode={movieListMode} />
      )}

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {!searchQuery && GENRES.map((genre) => (
        <GenreRow key={genre.id} genreId={genre.id} title={genre.name} />
    ))}
      


      {searchQuery && (
        <Button onClick={fetchData}>
          Takaisin etusivulle
        </Button>
      )}
    </>
  )
}

export default Homepage
