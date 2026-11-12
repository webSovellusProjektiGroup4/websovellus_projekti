import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../providers/AuthProvider.jsx'

function JoinToGroupPage() {
  const { token } = useParams()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = useState('')

  useEffect(() => {

    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    async function joinGroup() {
      try {
        const response = await axios.post('/api/groups/createMemberWithInvitation', { token })
        navigate(`/groups/${response.data.groupId}`)
      } catch (requestError) {
        setError(requestError)
      }
    }

    joinGroup()
  }, [loading, user, token])

  return (
    <main>
      {error ? <p role="alert">{error}</p> : <p>Liitytään ryhmään...</p>}
    </main>
  )
}

export default JoinToGroupPage
