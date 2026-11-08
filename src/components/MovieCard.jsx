import './MovieCard.css'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'
import { useState } from 'react'
import StarRating from './StarRating.jsx'


// Yksi elokuva: juliste, nimi ja arvosana.
function MovieCard({ movie }) {
  const [overviewOpen, setOverviewOpen] = useState(false)
  return (
    <div className="movie-card">
      {movie.poster_path && (
        <img className="movie-card-poster" src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
      )}
      <h3>{movie.title}</h3>
      <button onClick={()=>setOverviewOpen(true)}>Tarkastele kuvausta</button>
      <p>⭐ {movie.vote_average}</p>
      <StarRating movieId={movie.id} />
      
      {overviewOpen && (
        <div className="movie-overview">
          <p>{movie.overview || 'Ei kuvausta.'}</p>
          <button onClick={() => setOverviewOpen(false)}>Sulje</button>
        </div>
      )}
    </div>
  )
}

export default MovieCard

