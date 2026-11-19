
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography
} from '@mui/material'

function MovieListMovies({
  movies,
  loading,
  error,
  onRemoveMovie,
  actionLoading
}) {
  if (loading) {
    return <CircularProgress size={24} />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (movies.length === 0) {
    return <Typography>Lista on tyhjä.</Typography>
  }

  return (
    <Box
      component="ul"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 160px), 1fr))',
        gap: 2,
        listStyle: 'none',
        p: 0,
        m: 0
      }}
    >
      {movies.map((movie) => (
        <Card
          component="li"
          key={movie.tmdb_id}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          {movie.poster_path && (
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
              alt={movie.title || 'Elokuvajuliste'}
              sx={{
                aspectRatio: '2 / 3',
                objectFit: 'cover'
              }}
            />
          )}

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {movie.title || `Elokuva ${movie.tmdb_id}`}
            </Typography>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onRemoveMovie(movie.tmdb_id)}
              disabled={actionLoading}
            >
              Poista elokuva
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default MovieListMovies
