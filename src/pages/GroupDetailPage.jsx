// useEffect käynnistää haun; useState säilyttää tiedot ja näkymän tilat.
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'
import GroupInvitation from '../components/GroupInvitation.jsx'
import GroupChat from '../components/GroupChat.jsx'
import GroupJoinRequests from '../components/GroupJoinRequests.jsx'
import './GroupDetailPage.css'
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Stack,
  Typography
} from '@mui/material'

function GroupDetailPage() {
  // id tulee osoitteen reitistä, esimerkiksi /groups/12.
  const { id } = useParams()
  const navigate = useNavigate()

  // Ryhmän tiedot, lataustila, hallintaikkunan tila ja mahdollinen virhe.
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [groupManagementOpen, setGroupManagementOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Hakee ryhmän tiedot sivun avautuessa tai osoitteen id:n vaihtuessa.
    fetchGroup(true)
  }, [id])

  // Hakee ryhmän tiedot backendistä.
  async function fetchGroup(showLoading = false) {
    if (showLoading) {
      setLoading(true)
      setError('')
    }

    try {
      const response = await axios.get(`/api/groups/${id}`)
      setGroup(response.data.group)
    } catch (requestError) {
      if (requestError.response?.status === 404) {
        setError('Ryhmää ei löytynyt tai sinulla ei ole oikeutta nähdä sitä.')
      } else {
        setError('Ryhmän hakeminen epäonnistui.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Näytetään latausteksti, virhe tai ryhmän sisältö tilanteen mukaan.
  let pageContent

  if (loading) {
    pageContent = <Typography role="status">Ladataan ryhmää...</Typography>
  } else if (error !== '') {
    pageContent = <Alert severity="error" role="alert">{error}</Alert>
  } else if (group === null) {
    pageContent = <Typography>Ryhmän tietoja ei löytynyt.</Typography>
  } else {
    pageContent = (
      <>
        {/* Ryhmän perustiedot ja ylläpitäjälle näkyvä hallintapainike. */}
        <Paper className="group-detail" sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1">
              {group.name}
            </Typography>

            <Typography>
              Näkyvyys: {groupVisibilityText(group.visibility)}
            </Typography>

            <Typography>Roolisi ryhmässä: {group.role}</Typography>
            
            {group.role === 'admin' && (
              <Button
                variant="contained"
                onClick={() => setGroupManagementOpen(true)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Hallinnoi ryhmää
              </Button>
            )}
          </Stack>
        </Paper>


        {/* Keskustelu tuodaan erillisestä GroupChat-komponentista. */}
        <Paper className="group-chat" sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Keskustelu
          </Typography>

          <GroupChat groupId={group.id} />
        </Paper>


        {/* map luo listaan yhden jäsenrivin jokaista ryhmän jäsentä kohti. */}
        <Paper className="members-list" sx={{ p: 3 }}>
          <Typography variant="h6" component="h2">Jäsenet</Typography>
          <List>
            {group.members.map((member) => (
              <ListItem key={member.id ?? member.username}>
                <Typography>
                  {member.username} ({member.role},{' '}
                  {new Date(member.joined_at).toLocaleString('fi-FI', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                  )
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Hallintaikkunassa käsitellään liittymispyyntöjä ja kutsuja. */}
        <Dialog
          open={groupManagementOpen}
          onClose={() => setGroupManagementOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Ryhmän hallinta</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <GroupJoinRequests
                groupId={group.id}
                onMemberAdded={fetchGroup}
              />
              {group.role === 'admin' && (
                <GroupInvitation
                  groupId={group.id}
                  visibility={group.visibility}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGroupManagementOpen(false)}>
              Sulje
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  return (
    <Container
      component="main"
      className="group-page"
      maxWidth="md"
      sx={{ py: 5 }}
    >
      {/* Stack järjestää sivun osat pystysuuntaan tasavälein. */}
      <Stack spacing={3}>
        {pageContent}
        <Button
          type="button"
          variant="contained"
          onClick={() => navigate('/groups')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Palaa ryhmiin
        </Button>
      </Stack>
    </Container>
  )
}

export default GroupDetailPage