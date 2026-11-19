
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'

import EditMovieListForm from './EditMovieListForm.jsx'
import MovieListMovies from './MovieListMovies.jsx'

function MovieListItem({
  list,
  editingListId,
  editName,
  setEditName,
  editVisibility,
  setEditVisibility,
  actionLoading,
  openListId,
  listMovies,
  moviesLoading,
  moviesError,
  onOpenList,
  onStartEditing,
  onUpdateList,
  onCancelEditing,
  onDeleteList,
  onRemoveMovie,
  onCopyShareLink
}) {
  const visibilityText =
    list.visibility === 'private'
      ? 'Yksityinen'
      : list.visibility === 'public'
        ? 'Julkinen'
        : 'Linkillä jaettava'

  return (
    <Box component="li" sx={{ mb: 2 }}>
      <Paper sx={{ p: 3 }}>
        {editingListId === list.id ? (
          <EditMovieListForm
            name={editName}
            visibility={editVisibility}
            onNameChange={setEditName}
            onVisibilityChange={setEditVisibility}
            onSave={() => onUpdateList(list.id)}
            onCancel={onCancelEditing}
            loading={actionLoading}
          />
        ) : (
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Typography variant="h6">
                {list.name}
              </Typography>

              <Chip
                label={visibilityText}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              <Button
                variant="contained"
                onClick={() => onOpenList(list.id)}
              >
                Avaa lista
              </Button>

              <Button
                variant="outlined"
                onClick={() => onStartEditing(list)}
                disabled={actionLoading}
              >
                Muokkaa
              </Button>

              {list.visibility !== 'private' && (
                <Button
                  variant="outlined"
                  onClick={() => onCopyShareLink(list.id)}
                >
                  Kopioi jakolinkki
                </Button>
              )}

              <Button
                color="error"
                variant="outlined"
                onClick={() => onDeleteList(list.id)}
                disabled={actionLoading}
              >
                Poista lista
              </Button>
            </Stack>
          </Stack>
        )}

        {openListId === list.id && (
          <Box sx={{ mt: 3 }}>
            <MovieListMovies
              movies={listMovies}
              loading={moviesLoading}
              error={moviesError}
              actionLoading={actionLoading}
              onRemoveMovie={(tmdbId) =>
                onRemoveMovie(list.id, tmdbId)
              }
            />
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default MovieListItem
