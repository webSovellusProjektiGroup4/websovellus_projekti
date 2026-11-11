import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

function GroupsButton() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  function openGroupsPage() {
    navigate('/groups')
  }

  return (
    <button type="button" onClick={openGroupsPage}>
      Omat ryhmät
    </button>
  )
}

export default GroupsButton