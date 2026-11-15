
import { useState } from 'react'
import axios from 'axios'
import MovieRating from './MovieRating.jsx'
import { useAuth } from '../providers/AuthProvider.jsx'
import './MovieCard.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

// Yksi elokuva: juliste, nimi, arvosana ja listalle lisääminen.
function MovieCard({ movie }) {
  const { user } = useAuth()

  const [overviewOpen, setOverviewOpen] = useState(false)
  const [listSelectorOpen, setListSelectorOpen] = useState(false)
  const [lists, setLists] = useState([])
  const [selectedListId, setSelectedListId] = useState('')
  const [listLoading, setListLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [listMessage, setListMessage] = useState('')

  const handleOpenLists = async () => {
    if (listSelectorOpen) {
      setListSelectorOpen(false)
      return
    }

    setListLoading(true)
    setListMessage('')

    try {
      const response = await axios.get('/api/lists')
      const userLists = response.data.lists

      setLists(userLists)
      setSelectedListId(
        userLists.length > 0 ? String(userLists[0].id) : ''
      )
      setListSelectorOpen(true)
    } catch (error) {
      setListMessage('Listojen hakeminen epäonnistui.')
    } finally {
      setListLoading(false)
    }
  }

  const handleAddToList = async () => {
    if (!selectedListId) return

    setAdding(true)
    setListMessage('')

    try {
      await axios.post(`/api/lists/${selectedListId}/movies`, {
        tmdbId: movie.id
      })

      setListMessage('Elokuva lisättiin listalle!')
      setListSelectorOpen(false)
    } catch (error) {
      if (error.response?.status === 409) {
        setListMessage('Elokuva on jo tällä listalla.')
      } else {
        setListMessage('Elokuvan lisääminen epäonnistui.')
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="movie-card">
      {movie.poster_path && (
        <img
          className="movie-card-poster"
          src={`${IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
        />
      )}

      <h3>{movie.title}</h3>

      <div className="movie-card-rating">
        <MovieRating movieId={movie.id} />
      </div>

      <button
        type="button"
        onClick={() => setOverviewOpen(true)}
      >
        Kuvaus
      </button>

      {overviewOpen && (
        <div className="movie-overview">
          <p>{movie.overview || 'Ei kuvausta.'}</p>
          <button
            type="button"
            onClick={() => setOverviewOpen(false)}
          >
            Sulje
          </button>
        </div>
      )}

      {user && (
        <div className="movie-card-list">
          <button
            type="button"
            onClick={handleOpenLists}
            disabled={listLoading}
          >
            {listLoading ? 'Haetaan listoja...' : 'Lisää listalle'}
          </button>

          {listSelectorOpen && (
            <div>
              {lists.length === 0 ? (
                <p>Sinulla ei ole vielä elokuvalistoja.</p>
              ) : (
                <>
                  <select
                    value={selectedListId}
                    onChange={(event) =>
                      setSelectedListId(event.target.value)
                    }
                    aria-label="Valitse elokuvalista"
                  >
                    {lists.map((list) => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddToList}
                    disabled={adding || !selectedListId}
                  >
                    {adding ? 'Lisätään...' : 'Tallenna'}
                  </button>
                </>
              )}
            </div>
          )}

          {listMessage && <p role="status">{listMessage}</p>}
        </div>
      )}
    </div>
  )
}

export default MovieCard
