import { useState, useEffect } from 'react'
import axios from 'axios'
import "./MovieRating.css"
import { useAuth } from '../providers/AuthProvider.jsx'


function MovieRating({ movieId }) {
  const { user, logout } = useAuth()  
  const [average, setAverage] = useState(null)
  const [count, setCount] = useState(0)
  const [myRating, setMyRating] = useState(null)

  const load = async () => {
    const res = await axios.get(`/api/movies/${movieId}/reviews`)
    setAverage(res.data.average)
    setCount(res.data.count)
    setMyRating(res.data.myRating)
  }

  useEffect(() => {
    load()
  }, [movieId, user])

  const rate = async (n) => {
    await axios.post(`/api/movies/${movieId}/reviews`, { rating: n })
    load()
  }
        console.log(rate)

  return (
    <div>
      {user && (
        <div className="rating-buttons">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={n === myRating ? 'selected' : ''}
              onClick={() => rate(n)}
            >
              {n}
            </button>
          ))}
        </div>
      )}
      {myRating && <p className="my-rating">Arvosanasi: {myRating}</p>}
      <p>{count > 0 ? `⭐ ${average} (${count})` : 'Ei arvosteluja'}</p>
    </div>
  )
}

export default MovieRating