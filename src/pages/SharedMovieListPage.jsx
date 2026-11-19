
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Stack,
  Typography
} from '@mui/material'

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
    return (
      <Container sx={{ py: 4 }}>
        <CircularProgress />
        <Typography>Haetaan elokuvalistaa...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Elokuvalistaa ei löytynyt
          </Typography>

          <Alert severity="error">
            Lista voi olla yksityinen tai poistettu.
          </Alert>

          <Box>
            <Button component={Link} to="/" variant="outlined">
              Takaisin etusivulle
            </Button>
          </Box>
        </Stack>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {list.name}
        </Typography>

        <Typography color="text.secondary">
          Listan luonut: {list.owner}
        </Typography>

        <Typography variant="h5" component="h2">
          Listan elokuvat
        </Typography>

        {movies.length === 0 ? (
          <Alert severity="info">
            Lista on tyhjä.
          </Alert>
        ) : (
          <Box
            component="ul"
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(100%, 160px), 1fr))',
              gap: 2,
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {movies.map((movie) => (
              <Card component="li" key={movie.tmdb_id}>
                {movie.poster_path && (
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                    alt={movie.title}
                    sx={{
                      aspectRatio: '2 / 3',
                      objectFit: 'cover'
                    }}
                  />
                )}

                <CardContent>
                  <Typography>
                    {movie.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Box>
          <Button component={Link} to="/" variant="outlined">
            Takaisin etusivulle
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}

export default SharedMovieListPage
