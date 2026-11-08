
import { useState } from 'react'

function MovieSearch({ onSearch }) {
  const [searchText, setSearchText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const query = searchText.trim()

    if (query) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Hae elokuvaa..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <button type="submit">Hae</button>
    </form>
  )
}

export default MovieSearch
