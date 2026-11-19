// useEffect käynnistää ryhmien haun; useState säilyttää ryhmät ja käyttöliittymän tilat.
import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'
import { useAuth } from '../providers/AuthProvider.jsx'
import CreateGroupButton from '../components/CreateGroupButton.jsx'
import {
  Alert,
  Button,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'

function GroupsPage() {
  // user kertoo kirjautumistilan; authLoading kertoo, odotetaanko sen tarkistusta.
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Omien ryhmien lista, julkiset hakutulokset ja hakukentän teksti.
  const [groups, setGroups] = useState([])
  const [publicGroups, setPublicGroups] = useState(undefined)
  const [publicGroupSearch, setPublicGroupSearch] = useState('')
  // Sivun lataus- ja virhetilat.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [publicError, setPublicError] = useState('')

  useEffect(() => {
    // Odotetaan, että kirjautumistila on selvillä ennen omien ryhmien hakua.
    if (authLoading) return

    if (!user) {
      // Kirjautumattomalla käyttäjällä ei ole omia ryhmiä haettavana.
      setGroups([])
      setLoading(false)
      return
    }

    async function fetchGroups() {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get('/api/groups')
        setGroups(response.data.groups)
      } catch {
        setError('Ryhmien hakeminen epäonnistui.')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [authLoading, user])

  // Hakee julkiset ryhmät nykyisellä hakusanalla.
  async function fetchPublicGroups() {
    setPublicError('')

    try {
      const response = await axios.get('/api/groups/public', {
        params: { search: publicGroupSearch }
      })
      setPublicGroups(response.data.groups)
    } catch {
      setPublicError('Julkisten ryhmien haku epäonnistui.')
    }
  }

  // Liittää käyttäjän ryhmään ja avaa ryhmän sivun, jos pyyntö onnistuu.
  async function joinGroup(groupId) {
    setPublicError('')

    try {
      await axios.post(`/api/groups/${groupId}/join`)
      navigate(`/groups/${groupId}`)
    } catch {
      setPublicError('Ryhmään liittyminen epäonnistui.')
    }
  }

  // Kirjautumisen jälkeen käyttäjä palautetaan takaisin tälle sivulle.
  function goToLogin() {
    navigate('/login', { state: { from: location.pathname } })
  }

  // Valitaan omien ryhmien alueelle sisältö latauksen ja kirjautumistilan mukaan.
  let pageContent

  if (authLoading || loading) {
    pageContent = <Typography role="status">Ladataan ryhmiä...</Typography>
  } else if (!user) {
    pageContent = (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button type="button" variant="contained" onClick={goToLogin}>
          Kirjaudu
        </Button>
        <Typography component="span">nähdäksesi omat ryhmäsi.</Typography>
      </Stack>
    )
  } else if (error !== '') {
    pageContent = <Alert severity="error" role="alert">{error}</Alert>
  } else if (groups.length === 0) {
    pageContent = <Typography>Sinulla ei ole vielä ryhmiä.</Typography>
  } else {
    // map luo listaan yhden rivin jokaista omaa ryhmää kohti.
    pageContent = (
      <List disablePadding>
        {groups.map((group) => (
          <ListItem key={group.id} disablePadding>
            <ListItemText
              primary={
                <Link component={RouterLink} to={`/groups/${group.id}`}>
                  {group.name}
                </Link>
              }
              secondary={groupVisibilityText(group.visibility)}
            />
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: 5 }}>
      {/* Stack asettelee sivun osiot pystysuuntaan ja lisää niiden väliin tilaa. */}
      <Stack spacing={4}>
        <section>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Typography variant="h4" component="h1">
              Omat ryhmät
            </Typography>
            <CreateGroupButton />
          </Stack>
          {pageContent}
        </section>

        <section>
          <Typography variant="h5" component="h2" gutterBottom>
            Julkiset ryhmät
          </Typography>

          {/* Hakulomake hakee ryhmät Enterillä tai Hae-painikkeella. */}
          <Paper
            component="form"
            onSubmit={(event) => {
              event.preventDefault()
              fetchPublicGroups()
            }}
            sx={{ p: 2 }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                name="public-group"
                label="Etsi julkisia ryhmiä"
                value={publicGroupSearch}
                onChange={(event) => setPublicGroupSearch(event.target.value)}
                fullWidth
              />
              <Button type="submit" variant="contained">
                Hae
              </Button>
            </Stack>
          </Paper>

          {publicError && (
            <Alert severity="error" role="alert" sx={{ mt: 2 }}>
              {publicError}
            </Alert>
          )}
           {/* Tulokset näytetään vasta ensimmäisen haun jälkeen. */}
          {publicGroups !== undefined && (
            publicGroups.length === 0 ? (
              <Typography sx={{ mt: 2 }}>
                Julkisia ryhmiä ei löytynyt hakusanalla.
              </Typography>
            ) : (
              <List>
                {publicGroups.map((group) => (
                  <ListItem
                    key={group.id}
                    divider
                    secondaryAction={
                      group.is_member
                        ? null
                        : user
                          ? (
                            <Button
                              type="button"
                              onClick={() => joinGroup(group.id)}
                            >
                              Liity ryhmään
                            </Button>
                          )
                          : (
                            <Button type="button" onClick={goToLogin}>
                              Kirjaudu liittyäksesi
                            </Button>
                          )
                    }
                  >
                    <ListItemText
                      primary={
                        group.is_member
                          ? (
                            <Link
                              component={RouterLink}
                              to={`/groups/${group.id}`}
                            >
                              {group.name}
                            </Link>
                          )
                          : group.name
                      }
                      secondary={`${group.member_count} jäsentä${group.is_member ? ' · olet jäsen' : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            )
          )}
        </section>

        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Palaa etusivulle
        </Button>
      </Stack>
    </Container>
  )
}

export default GroupsPage