
import { useState, useEffect } from 'react'
import axios from 'axios'
import './Homepage.css'
import MovieList from '../components/MovieList.jsx'
import MovieSearch from '../components/MovieSearch.jsx'

function Homepage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get('/api/movies/popular')
      setMovies(response.data.results)
      setSearchQuery('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

   const handleSearch = async (query) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get('/api/movies/search', {
        params: { query }
      })

      setMovies(response.data.results)
      setSearchQuery(query)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <h1>Elokuvahaku</h1>

      <MovieSearch onSearch={handleSearch} />

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
        <MovieList movies={movies} />
      )}

      {error && (
      <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}


      {searchQuery && (
        <button onClick={fetchData}>
          Takaisin etusivulle
        </button>
      )}
    </>
  )
}

export default Homepage
