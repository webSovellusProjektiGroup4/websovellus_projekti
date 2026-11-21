import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../providers/AuthProvider.jsx'
import './MovieDetailPage.css'
import MovieRating from '../components/MovieRating.jsx'
import AddToList from '../components/AddToList.jsx'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

function MovieDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    try {

      axios.get(`/api/movies/${id}`).then((response) => setMovie(response.data))
    } catch (error) {
      console.error('Hakeminen epäonnistui', error)
    }
  }, [id])

  //Otetaan toinen overflow pois

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // takaisin sivulle, jolta tultiin
  const close = () => (location.state?.background ? navigate(-1) : navigate('/'))

  if (!movie) return <div className="movie-detail">Ladataan...</div>
  const year = movie.release_date?.slice(0, 4)
  const genres = movie.genres?.map((g) => g.name).join(', ')
  const director = movie.credits?.crew?.find((p) => p.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 6).map((p) => p.name).join(', ')

  return (
    <div className="movie-detail">
      <IconButton aria-label="Sulje" onClick={close} className="movie-detail-close">
        <CloseIcon />
      </IconButton>

      <div className="movie-detail-top" >
        <img
          className="movie-card-poster"
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt=""
        />

        <div>
          <Typography variant="h4" component="h1">
            {movie.title} {year && `(${year})`}
          </Typography>

          <p>{movie.overview || 'Ei kuvausta.'}</p>
          {genres && <p><strong>Genret:</strong> {genres}</p>}

          {director && <p><strong>Ohjaaja:</strong> {director.name}</p>}
          {cast && <p><strong>Näyttelijät:</strong> {cast}</p>}

        </div>
      </div>
      <br></br>

      {user && (
        <div className="movie-detail-actions">
          <MovieRating movieId={movie.id} />
          <AddToList movieId={movie.id}></AddToList>
        </div>
      )}
    </div>
  )
}

export default MovieDetailPage
