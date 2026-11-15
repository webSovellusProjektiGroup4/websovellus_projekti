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
  const [pendingRequest, setPendingRequest] = useState(false)


  useEffect(() => {

    if (loading) return
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    async function joinGroup() {
      try {
        const response = await axios.post('/api/groups/createMemberWithInvitation', { token })
        if(response.data.member){
          navigate(`/groups/${response.data.groupId}`)
        } else {
          setPendingRequest(true)
        }
      } catch (requestError) {
        setError(requestError)
      }
    }

    joinGroup()
  }, [loading, user, token])

  return (
    <main>
      {pendingRequest ? <>
      <p>Liittymispyyntö on lähetetty</p>
       <button type="button" onClick={() => navigate('/')}>
        Palaa etusivulle
      </button>
      </> : 
      error ? <p role="alert">{error}</p> : <p>Liitytään ryhmään...</p>}
    </main>
  )
}

export default JoinToGroupPage
