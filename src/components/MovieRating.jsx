import { useState, useEffect } from 'react'
import axios from 'axios'

function MovieRating({ movieId }) {
  const [average, setAverage] = useState(null)
  const [count, setCount] = useState(0)

  const load = async () => {
    const res = await axios.get(`/api/movies/${movieId}/reviews`)
    setAverage(res.data.average)
    setCount(res.data.count)
  }

  useEffect(() => {
    load()
  }, [movieId])

  const rate = async (n) => {
    await axios.post(`/api/movies/${movieId}/reviews`, { rating: n })
    load()
  }

  return (
    <div>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => rate(n)}>{n}</button>
      ))}
      <p>{count > 0 ? `Käyttäjät: ${average} (${count})` : 'Ei arvosteluja'}</p>
    </div>
  )
}

export default MovieRating