import { useState, useEffect } from 'react'
import axios from 'axios'
import MessageBox from './MessageBox'
import { useAuth } from '../providers/AuthProvider'
import './MessageBox.css'
import { TextField, Button, Alert } from '@mui/material'

function GroupChat({ groupId }) {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  // Hakee ryhmän viestit backendistä
  async function fetchMessages() {
    try {
      const response = await axios.get(`/api/groups/${groupId}/messages`)
      setMessages(response.data)
    } catch (requestError) {
      setError('Viestien hakeminen epäonnistui.')
    }
  }

  // Haetaan viestit, kun komponentti tulee näkyviin tai ryhmä vaihtuu
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [groupId])

  async function sendMessage(event) {
    event.preventDefault()
    setError('')

    const cleanText = text.trim()
    if (cleanText === '') {
      return
    }

    setSending(true)

    try {
      await axios.post(`/api/groups/${groupId}/messages`, {
        content: cleanText
      })
      setText('')
      // Haetaan lista uudelleen, jotta uusi viesti näkyy
      await fetchMessages()
    } catch (requestError) {
      const serverError = requestError.response?.data?.error
      setError(typeof serverError === 'string' ? serverError : 'Viestin lähetys epäonnistui.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {messages.length === 0 ? (
        <p>Ei vielä viestejä.</p>
      ) : (
        <ul className="message-list">
          {messages.map((message) => (
            <MessageBox key={message.id} message={message} user={user} />
          ))}
        </ul>
      )}

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <TextField
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Kirjoita viesti..."
          size="small"
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" disabled={sending || !text.trim()}>
          {sending ? 'Lähetetään...' : 'Lähetä'}
        </Button>
      </form>

      {error && <Alert severity="error">{error}</Alert>}
    </div>
  )
}

export default GroupChat
