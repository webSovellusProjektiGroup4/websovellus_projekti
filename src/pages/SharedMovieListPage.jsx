
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

function SharedMovieListPage() {
    const { listId } = useParams()

    const [list, setList] = useState(null)
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchSharedList = async () => {
            setLoading(true)
            setError('')

            try {
                const response = await axios.get(
                    `/api/lists/shared/${listId}`
                )

                setList(response.data.list)
                setMovies(response.data.movies)
            } catch (err) {
                setError('Jaettua elokuvalistaa ei löytynyt.')
            } finally {
                setLoading(false)
            }
        }

        fetchSharedList()
    }, [listId])

    if (loading) {
        return <main><p>Haetaan elokuvalistaa...</p></main>
    }

    if (error) {
        return (
            <main>
                <h1>Elokuvalistaa ei löytynyt</h1>
                <p>Lista voi olla yksityinen tai poistettu.</p>
                <Link to="/">Takaisin etusivulle</Link>
            </main>
        )
    }

    return (
        <main>
            <h1>{list.name}</h1>

            <p>Listan luonut: {list.owner}</p>

            <h2>Listan elokuvat</h2>

            {movies.length === 0 ? (
                <p>Lista on tyhjä.</p>
            ) : (

                <ul>
                    {movies.map((movie) => (
                        <li key={movie.tmdb_id}>
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                    alt={movie.title}
                                    width="100"
                                />
                            )}

                            <p>{movie.title}</p>
                        </li>
                    ))}
                </ul>

            )}

            <p>
                <Link to="/">Takaisin etusivulle</Link>
            </p>
        </main>
    )
}

export default SharedMovieListPage
