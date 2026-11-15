
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import useMovieLists from '../hooks/useMovieLists.js'

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
    return <p>Tarkistetaan kirjautumista...</p>
  }

  if (!user) {
    return (
      <main>
        <h1>Omat elokuvalistat</h1>
        <p>Kirjaudu sisään luodaksesi elokuvalistoja.</p>
        <Link to="/login">Kirjaudu sisään</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Omat elokuvalistat</h1>

      <h2>Luo uusi lista</h2>

      <CreateMovieListForm
        name={name}
        visibility={visibility}
        saving={saving}
        onNameChange={setName}
        onVisibilityChange={setVisibility}
        onSubmit={handleSubmit}
      />

      {success && <p role="status">{success}</p>}
      {error && <p role="alert">{error}</p>}

      <h2>Luomasi elokuvalistat</h2>

      {actionError && <p role="alert">{actionError}</p>}

      {loadingLists ? (
        <p>Haetaan listoja...</p>
      ) : lists.length === 0 ? (
        <p>Et ole vielä luonut elokuvalistoja.</p>
      ) : (
        <ul>
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
        </ul>
      )}

      <p>
        <Link to="/">Takaisin etusivulle</Link>
      </p>
    </main>
  )
}

export default MovieListsPage
