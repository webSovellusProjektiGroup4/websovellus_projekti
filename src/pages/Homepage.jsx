import { useState, useEffect } from 'react'
import axios from 'axios'
import './Homepage.css'
import MovieList from '../components/Movielist'
function Homepage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get('/api/movies/popular')
      setMovies(response.data.results)
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
      <h2>Suositut elokuvat</h2>
        {loading && <p>Loading...</p>}
        {console.log(movies)}
        {movies && (
          <MovieList movies = {movies}></MovieList>
        )}
        
        {error && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'red' }}>
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
    </>
  )
}

export default Homepage
