import { Box, Paper, Typography } from '@mui/material'

function MessageBox({ message, user }) {
  const isOwn = user.username === message.username

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

        <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.content}
        </Typography>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7 }}>
          {new Date(message.created_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}
        </Typography>
      </Paper>
    </Box>
  )
}

export default MessageBox