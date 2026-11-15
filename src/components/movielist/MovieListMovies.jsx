
function MovieListMovies({
  movies,
  loading,
  error,
  onRemoveMovie,
  actionLoading
}) {
  if (loading) {
    return <p>Haetaan elokuvia...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (movies.length === 0) {
    return <p>Lista on tyhjä.</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {movies.map((movie) => (
        <li key={movie.tmdb_id} style={{ marginBottom: '20px' }}>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
              alt={movie.title}
              width="100"
            />
          )}

          <p>{movie.title || `Elokuva ${movie.tmdb_id}`}</p>

          <button
            type="button"
            onClick={() => onRemoveMovie(movie.tmdb_id)}
            disabled={actionLoading}
          >
            Poista elokuva
          </button>
        </li>
      ))}
    </ul>
  )
}

export default MovieListMovies
