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

// Muistissa pidettävä välimuisti elokuvien nimille ja julisteille.
// Ryhmächat hakee viestit 5 s välein, joten ilman tätä sama elokuva haettaisiin TMDB:stä jatkuvasti.
const movieDetailsCache = new Map()
const MAX_CACHED_MOVIES = 1000

const fetchMovieDetails = async (tmdbId) => {
  const cached = movieDetailsCache.get(Number(tmdbId))
  if (cached) {
    return cached
  }

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
    // 404 = elokuvaa ei ole TMDB:ssä, muut virheet ovat TMDB:n päässä
    error.status = response.status === 404 ? 404 : 502
    throw error
  }

  const movie = await response.json()

  const details = {
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path
  }

  if (movieDetailsCache.size >= MAX_CACHED_MOVIES) {
    movieDetailsCache.clear()
  }
  movieDetailsCache.set(movie.id, details)

  return details
}


export { fetchPopularMovies, searchMovies, fetchMovieDetails, fetchMoviesByGenre }