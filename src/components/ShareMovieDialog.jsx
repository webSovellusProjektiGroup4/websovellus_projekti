import { useState } from 'react'
import axios from 'axios'
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import MovieSearch from './MovieSearch'

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w92'

function MoviePoster({ movie }) {
  return (
    <Avatar
      variant="rounded"
      src={movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : undefined}
      alt=""
      sx={{ width: 46, height: 69 }}
    >
      🎬
    </Avatar>
  )
}

const releaseYear = (movie) => (movie.release_date ? movie.release_date.slice(0, 4) : null)

// Ikkuna, jossa haetaan elokuva ja jaetaan se ryhmän keskusteluun.
// Vaihe 1: haku ja elokuvan valinta. Vaihe 2: valinnainen viesti ja jakaminen.
function ShareMovieDialog({ open, onClose, groupId, onShared }) {
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [comment, setComment] = useState('')
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    setResults([])
    setSearched(false)
    setSelectedMovie(null)
    setComment('')
    setError('')
    onClose()
  }

  async function searchMovies(query) {
    setSearching(true)
    setError('')

    try {
      const response = await axios.get('/api/movies/search', { params: { query } })
      setResults(response.data.results ?? [])
      setSearched(true)
    } catch {
      setError('Elokuvien haku epäonnistui.')
    } finally {
      setSearching(false)
    }
  }

  async function shareMovie(event) {
    event.preventDefault()
    setSharing(true)
    setError('')

    try {
      await axios.post(`/api/groups/${groupId}/movies`, {
        tmdbId: selectedMovie.id,
        comment: comment.trim()
      })
      await onShared()
      handleClose()
    } catch (requestError) {
      const serverError = requestError.response?.data?.error
      setError(typeof serverError === 'string' ? serverError : 'Elokuvan jakaminen epäonnistui.')
    } finally {
      setSharing(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Jaa elokuva ryhmälle</DialogTitle>

      {selectedMovie === null ? (
        <>
          <DialogContent dividers>
            <Stack spacing={2}>
              <MovieSearch onSearch={searchMovies} />

              {error && <Alert severity="error">{error}</Alert>}
              {searching && <Typography role="status">Haetaan...</Typography>}
              {!searching && searched && results.length === 0 && (
                <Typography>Elokuvia ei löytynyt.</Typography>
              )}

              <List>
                {results.map((movie) => (
                  <ListItemButton key={movie.id} onClick={() => setSelectedMovie(movie)}>
                    <ListItemAvatar sx={{ mr: 2 }}>
                      <MoviePoster movie={movie} />
                    </ListItemAvatar>
                    <ListItemText primary={movie.title} secondary={releaseYear(movie)} />
                  </ListItemButton>
                ))}
              </List>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Peruuta</Button>
          </DialogActions>
        </>
      ) : (
        <form onSubmit={shareMovie}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <MoviePoster movie={selectedMovie} />
                <div>
                  <Typography fontWeight={600}>{selectedMovie.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {releaseYear(selectedMovie)}
                  </Typography>
                </div>
              </Stack>

              <TextField
                label="Lisää viesti (valinnainen)"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                multiline
                minRows={2}
                autoFocus
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setSelectedMovie(null)} disabled={sharing}>
              Valitse toinen
            </Button>
            <Button type="submit" variant="contained" disabled={sharing}>
              {sharing ? 'Jaetaan...' : 'Jaa'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}

export default ShareMovieDialog
