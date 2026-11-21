import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Button, MenuItem, Stack, TextField } from '@mui/material'

function AddToList({ movieId }) {
  const [lists, setLists] = useState([])
  const [selectedListId, setSelectedListId] = useState('')
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error' | 'info', text }

  useEffect(() => {
    axios.get('/api/lists')
      .then((response) => {
        setLists(response.data.lists)
        if (response.data.lists.length > 0) setSelectedListId(String(response.data.lists[0].id))
      })
      .catch(() => setMessage({ type: 'error', text: 'Listojen hakeminen epäonnistui.' }))
  }, [])

  const handleAdd = async () => {
    setAdding(true)
    setMessage(null)
    try {
      await axios.post(`/api/lists/${selectedListId}/movies`, { tmdbId: movieId })
      setMessage({ type: 'success', text: 'Elokuva lisättiin listalle.' })
    } catch (error) {
      setMessage(error.response?.status === 409
        ? { type: 'info', text: 'Elokuva on jo tällä listalla.' }
        : { type: 'error', text: 'Elokuvan lisääminen epäonnistui.' })
    } finally {
      setAdding(false)
    }
  }

  if (lists.length === 0 && !message) {
    return <Alert severity="info">Sinulla ei ole vielä elokuvalistoja.</Alert>
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <TextField
          select
          label="Elokuvalista"
          value={selectedListId}
          sx={{ backgroundColor: 'white', maxWidth: '300px' }}
          onChange={(e) => setSelectedListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem key={list.id} value={String(list.id)}>{list.name}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAdd} disabled={adding || !selectedListId}>
          Lisää
        </Button>
      </Stack>
      {message && <Alert severity={message.type}>{message.text}</Alert>}
    </Stack>
  )
}

export default AddToList
