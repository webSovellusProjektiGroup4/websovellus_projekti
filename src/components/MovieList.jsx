import MovieCard from './MovieCard.jsx'
import "./MovieList.css"

function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <p>Ei elokuvia.</p>
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieList
