import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

function CreateGroupButton() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  function openCreateGroupPage() {
    navigate('/groups/new')
  }

  return (
    <button type="button" onClick={openCreateGroupPage}>
      Luo ryhmä
    </button>
  )
}

export default CreateGroupButton