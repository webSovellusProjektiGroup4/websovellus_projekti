// React Routerin avulla vaihdetaan näkymää lataamatta koko sivua uudelleen.
import { useNavigate } from 'react-router-dom'
// MUI:n valmis painikekomponentti.
import { Button } from '@mui/material'

function GroupsButton() {
  // navigate-funktiolla siirrytään sovelluksen toiselle reitille.
  const navigate = useNavigate()

  // Painikkeen painaminen avaa ryhmien listauksen.
  function openGroupsPage() {
    navigate('/groups')
  }

  return (
    <Button type="button" variant="outlined" onClick={openGroupsPage}>
      Ryhmät
    </Button>
  )
}

export default GroupsButton