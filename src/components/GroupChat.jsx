import { useState } from 'react'
import axios from 'axios'

function GroupChat({ groupId }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

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
    } catch (requestError) {
      const serverError = requestError.response?.data?.error
      setError(typeof serverError === 'string' ? serverError : 'Viestin lähetys epäonnistui.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Kirjoita viesti..."
      />
      <button type="submit" disabled={sending}>
        {sending ? 'Lähetetään...' : 'Lähetä'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}

export default GroupChat