import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

function GroupsButton() {
  const { user } = useAuth()
  const navigate = useNavigate()



  function openGroupsPage() {
    navigate('/groups')
  }

  return (
    <button type="button" onClick={openGroupsPage}>
      Ryhmät
    </button>
  )
}

export default GroupsButton