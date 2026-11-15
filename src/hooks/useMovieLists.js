
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

function useMovieLists(user) {
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [lists, setLists] = useState([])
  const [loadingLists, setLoadingLists] = useState(true)

  const [openListId, setOpenListId] = useState(null)
  const [listMovies, setListMovies] = useState([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [moviesError, setMoviesError] = useState('')

  const [editingListId, setEditingListId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editVisibility, setEditVisibility] = useState('private')

  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Haetaan käyttäjän omat elokuvalistat
  const fetchLists = useCallback(async () => {
    setLoadingLists(true)

    try {
      const response = await axios.get('/api/lists')
      setLists(response.data.lists)
    } catch (err) {
      setError('Elokuvalistojen hakeminen epäonnistui.')
    } finally {
      setLoadingLists(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchLists()
    } else {
      setLists([])
      setLoadingLists(false)
    }
  }, [user, fetchLists])

  // Uuden elokuvalistan luominen
  const handleSubmit = async (event) => {
    event.preventDefault()

    const cleanName = name.trim()

    if (!cleanName) {
      setError('Anna listalle nimi.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('/api/lists', {
        name: cleanName,
        visibility
      })

      setSuccess(`Lista "${response.data.list.name}" luotiin!`)
      setName('')
      await fetchLists()
    } catch (err) {
      setError(
        err.response?.data?.error || 'Listan luominen epäonnistui.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Listan avaaminen ja sen elokuvien hakeminen
  const handleOpenList = async (listId) => {
    if (openListId === listId) {
      setOpenListId(null)
      return
    }

    setOpenListId(listId)
    setMoviesLoading(true)
    setMoviesError('')
    setListMovies([])

    try {
      const response = await axios.get(
        `/api/lists/${listId}/movies`
      )

      setListMovies(response.data.movies)
    } catch (err) {
      setMoviesError(
        'Listan elokuvien hakeminen epäonnistui.'
      )
    } finally {
      setMoviesLoading(false)
    }
  }

  // Listan muokkaamisen aloittaminen
  const startEditing = (list) => {
    setEditingListId(list.id)
    setEditName(list.name)
    setEditVisibility(list.visibility)
    setActionError('')
  }

  // Listan nimen ja näkyvyyden päivittäminen
  const handleUpdateList = async (listId) => {
    setActionLoading(true)
    setActionError('')

    try {
      await axios.put(`/api/lists/${listId}`, {
        name: editName.trim(),
        visibility: editVisibility
      })

      setEditingListId(null)
      await fetchLists()
    } catch (err) {
      setActionError(
        'Listan muokkaaminen epäonnistui.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Kokonaisen elokuvalistan poistaminen
  const handleDeleteList = async (listId) => {
    const confirmed = window.confirm(
      'Haluatko varmasti poistaa tämän listan?'
    )

    if (!confirmed) return

    setActionLoading(true)
    setActionError('')

    try {
      await axios.delete(`/api/lists/${listId}`)

      if (openListId === listId) {
        setOpenListId(null)
        setListMovies([])
      }

      if (editingListId === listId) {
        setEditingListId(null)
      }

      await fetchLists()
    } catch (err) {
      setActionError(
        'Listan poistaminen epäonnistui.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Yksittäisen elokuvan poistaminen listalta
  const handleRemoveMovie = async (listId, tmdbId) => {
    setActionLoading(true)
    setActionError('')

    try {
      await axios.delete(
        `/api/lists/${listId}/movies/${tmdbId}`
      )

      setListMovies((currentMovies) =>
        currentMovies.filter(
          (movie) => movie.tmdb_id !== tmdbId
        )
      )
    } catch (err) {
      setActionError(
        'Elokuvan poistaminen epäonnistui.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  // Julkisen tai linkillä jaettavan listan linkki
  const handleCopyShareLink = async (listId) => {
    const shareUrl =
      `${window.location.origin}/shared/lists/${listId}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      window.alert('Jakolinkki kopioitu!')
    } catch (err) {
      window.prompt('Kopioi jakolinkki:', shareUrl)
    }
  }

  return {
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
  }
}

export default useMovieLists
