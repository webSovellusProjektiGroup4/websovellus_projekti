
const fetchPopularMovies = async () => {
  const API_TOKEN = process.env.TMDB_API_TOKEN
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
        console.log(movies)
        return movies

}

export { fetchPopularMovies }