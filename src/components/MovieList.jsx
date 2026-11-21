import MovieCard from './MovieCard.jsx'
import MoviePosterCard from './MoviePosterCard.jsx'
import './MovieList.css'

function MovieList({ movies, mode }) {
  if (!movies || movies.length === 0) {
    return <p>Ei elokuvia.</p>
  }

  // rivi, täydet kortit (arvostelut, kuvaus, listalle lisääminen)
  if (mode === 'row') {
    return (
      <div className="movie-list">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    )
  }

  // ruudukko,  pelkät julisteet
  return (
    <div className="movie-grid">
      {movies.map((movie) => <MoviePosterCard key={movie.id} movie={movie} />)}
    </div>
  )
}

export default MovieList
