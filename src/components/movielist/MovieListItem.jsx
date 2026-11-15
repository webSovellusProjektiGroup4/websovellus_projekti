
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
  return (
    <li>
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
        <div>
          <button
            type="button"
            onClick={() => onOpenList(list.id)}
          >
            {list.name}
          </button>

          {' – '}

          {list.visibility === 'private'
            ? 'Yksityinen'
            : list.visibility === 'public'
              ? 'Julkinen'
              : 'Linkillä jaettava'}

          <button
            type="button"
            onClick={() => onStartEditing(list)}
            disabled={actionLoading}
          >
            Muokkaa
          </button>

          {list.visibility !== 'private' && (
            <button
              type="button"
              onClick={() => onCopyShareLink(list.id)}
            >
              Kopioi jakolinkki
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteList(list.id)}
            disabled={actionLoading}
          >
            Poista lista
          </button>
        </div>
      )}

      {openListId === list.id && (
        <MovieListMovies
          movies={listMovies}
          loading={moviesLoading}
          error={moviesError}
          actionLoading={actionLoading}
          onRemoveMovie={(tmdbId) =>
            onRemoveMovie(list.id, tmdbId)
          }
        />
      )}
    </li>
  )
}

export default MovieListItem
