import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import './MovieCard.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

// Hakutulosten julistekortti
function MoviePosterCard({ movie }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [overviewOpen, setOverviewOpen] = useState(false)

  const openDetails = () => navigate(`/movies/${movie.id}`, { state: { background: location } })

  const openOverview = (e) => {
    e.stopPropagation()
    setOverviewOpen(true)
  }

  return (
    <div
      className="movie-card"
      role="link"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => { if (e.key === 'Enter') openDetails() }}
    >
      {movie.poster_path && (
        <img
          className="movie-card-poster"
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt=""
        />
      )}
      <h3>{movie.title}</h3>

      <Button type="button" onClick={openOverview} sx={{ mt: 'auto' }}>
        Kuvaus
      </Button>

      {overviewOpen && (
        <div className="movie-overview" onClick={(e) => e.stopPropagation()}>
          <IconButton
            aria-label="Sulje"
            size="small"
            onClick={() => setOverviewOpen(false)}
            sx={{ position: 'sticky', top: 0, alignSelf: 'flex-end', color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography>{movie.overview || 'Ei kuvausta.'}</Typography>
        </div>
      )}
    </div>
  )
}

export default MoviePosterCard
