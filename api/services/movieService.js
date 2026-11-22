const API_TOKEN = process.env.TMDB_API_TOKEN

const fetchPopularMovies = async () => {
   const response = await fetch(
     `https://api.themoviedb.org/3/movie/popular?language=fi-FI`,
     { headers: { Authorization: `Bearer ${API_TOKEN}` } }
   );
    if(!response.ok){
        const error = new Error(`TMDB-haku epäonnistui (${response.status})`)
        error.status = 502
        throw error

    }
        const movies = await response.json();
        return movies

}

const fetchMoviesByGenre = async (genreId) => {
  const params = new URLSearchParams({
    with_genres: genreId,
    sort_by: 'popularity.desc',
    language: 'fi-FI',
    'vote_count.gte': 20
  })

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params}`,
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  )

  if (!response.ok) {
    const error = new Error(`TMDB-haku epäonnistui (${response.status})`)
    error.status = 502
    throw error
  }

  const movies = await response.json()
  return movies
}

const searchMovies = async (query) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=fi-FI`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      }
    }
  )

  if(!response.ok) {
    const error = new Error(`TMDB-haku epäonnistui (${response.status})`)
    error.status = 502
    throw error
  }

  const movies = await response.json()
  return movies
}

const fetchMovieDetails = async (tmdbId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?language=fi-FI`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`
      }
    }
  )

  if (!response.ok) {
    const error = new Error(
      `Elokuvan tietojen hakeminen epäonnistui (${response.status})`
    )
    error.status = 502
    throw error
  }

  const movie = await response.json()

  return {
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path
  }
}


export { fetchPopularMovies, searchMovies, fetchMovieDetails, fetchMoviesByGenre }