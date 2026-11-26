import { useLocation, useNavigate } from 'react-router-dom'
import { Box, ButtonBase, Paper, Typography } from '@mui/material'

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w92'

// Jaetun elokuvan kortti. Klikkaus avaa elokuvan tiedot chatin päälle.
function SharedMovie({ movie }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <ButtonBase
      onClick={() => navigate(`/movies/${movie.tmdb_id}`, { state: { background: location } })}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mt: 0.5,
        p: 1,
        borderRadius: 1,
        bgcolor: 'rgba(0, 0, 0, 0.15)',
        textAlign: 'left',
      }}
    >
      {movie.poster_path ? (
        <img
          src={`${POSTER_BASE_URL}${movie.poster_path}`}
          alt=""
          width={46}
          height={69}
          style={{ borderRadius: 4, objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ width: 46, height: 69, display: 'grid', placeItems: 'center' }}>🎬</Box>
      )}
      <Typography fontWeight={600}>{movie.title}</Typography>
    </ButtonBase>
  )
}

function MessageBox({ message, user }) {
  const isOwn = user?.id === message.user_id
  const isMovie = message.type === 'movie'

  return (
    <Box
      component="li"
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        listStyle: 'none',
        mb: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          maxWidth: '70%',
          bgcolor: isOwn ? 'primary.main' : 'action.selected',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          {message.username}
        </Typography>

        {isMovie ? (
          <>
            <Typography variant="body2">jakoi elokuvan</Typography>
            <SharedMovie movie={message.movie} />
            {message.comment && (
              <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {message.comment}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        )}

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7 }}>
          {new Date(message.created_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}
        </Typography>
      </Paper>
    </Box>
  )
}

export default MessageBox
