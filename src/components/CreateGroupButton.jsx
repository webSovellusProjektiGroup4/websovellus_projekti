// useNavigate mahdollistaa reitille siirtymisen ilman koko sivun lataamista.
import { useNavigate } from 'react-router-dom'
// useAuth kertoo, onko käyttäjä kirjautunut sisään.
import { useAuth } from '../providers/AuthProvider.jsx'
// MUI:n valmis painike.
import { Button } from '@mui/material'

function CreateGroupButton() {
  // Kirjautumistieto tarvitaan, jotta luontipainike voidaan piilottaa kirjautumattomalta.
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  // Avaa ryhmän luontisivun reitillä /groups/new.
  function openCreateGroupPage() {
    navigate('/groups/new')
  }

  return (
    <Button type="button" variant="contained" onClick={openCreateGroupPage}>
      Luo ryhmä
    </Button>
  )
}

export default CreateGroupButton