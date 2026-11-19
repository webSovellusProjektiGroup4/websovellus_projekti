
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import useMovieLists from '../hooks/useMovieLists.js'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material'

import CreateMovieListForm from '../components/movielist/CreateMovieListForm.jsx'
import MovieListItem from '../components/movielist/MovieListItem.jsx'

function MovieListsPage() {
  const { user, loading } = useAuth()

  const {
    name,
    setName,
    visibility,
    setVisibility,
    saving,
    error,
    success,
    lists,
    loadingLists,
    openListId,
    listMovies,
    moviesLoading,
    moviesError,
    editingListId,
    setEditingListId,
    editName,
    setEditName,
    editVisibility,
    setEditVisibility,
    actionError,
    actionLoading,
    handleSubmit,
    handleOpenList,
    startEditing,
    handleUpdateList,
    handleDeleteList,
    handleRemoveMovie,
    handleCopyShareLink
  } = useMovieLists(user)

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Tarkistetaan kirjautumista...</Typography>
        </Stack>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Omat elokuvalistat
          </Typography>

          <Alert severity="info">
            Kirjaudu sisään luodaksesi elokuvalistoja.
          </Alert>

          <Box>
            <Button
              component={Link}
              to="/login"
              variant="contained"
            >
              Kirjaudu sisään
            </Button>
          </Box>
        </Stack>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>

        <Typography variant="h4" component="h1" fontWeight="bold">
          Omat elokuvalistat
        </Typography>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            <Typography variant="h5" component="h2">
              Luo uusi lista
            </Typography>

            <CreateMovieListForm
              name={name}
              visibility={visibility}
              saving={saving}
              onNameChange={setName}
              onVisibilityChange={setVisibility}
              onSubmit={handleSubmit}
            />

            {success && (
              <Alert severity="success" role="status">
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>

        <Box>
          <Stack spacing={3}>

            <Typography variant="h5" component="h2">
              Luomasi elokuvalistat
            </Typography>

            {actionError && (
              <Alert severity="error" role="alert">
                {actionError}
              </Alert>
            )}

            {loadingLists ? (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <CircularProgress size={24} />
                <Typography>Haetaan listoja...</Typography>
              </Stack>
            ) : lists.length === 0 ? (
              <Alert severity="info">
                Et ole vielä luonut elokuvalistoja.
              </Alert>
            ) : (
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0
                }}
              >
                {lists.map((list) => (
                  <MovieListItem
                    key={list.id}
                    list={list}
                    editingListId={editingListId}
                    editName={editName}
                    setEditName={setEditName}
                    editVisibility={editVisibility}
                    setEditVisibility={setEditVisibility}
                    actionLoading={actionLoading}
                    openListId={openListId}
                    listMovies={listMovies}
                    moviesLoading={moviesLoading}
                    moviesError={moviesError}
                    onOpenList={handleOpenList}
                    onStartEditing={startEditing}
                    onUpdateList={handleUpdateList}
                    onCancelEditing={() => setEditingListId(null)}
                    onDeleteList={handleDeleteList}
                    onRemoveMovie={handleRemoveMovie}
                    onCopyShareLink={handleCopyShareLink}
                  />
                ))}
              </Box>
            )}
          </Stack>
        </Box>

        <Box>
          <Button
            component={Link}
            to="/"
            variant="outlined"
          >
            Takaisin etusivulle
          </Button>
        </Box>

      </Stack>
    </Container>
  )
}

export default MovieListsPage
