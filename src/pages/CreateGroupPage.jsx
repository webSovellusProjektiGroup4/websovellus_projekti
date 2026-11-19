// useState säilyttää lomakkeen arvot ja viestit sivun renderöintien välillä.
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './LoginAndRegisterPage.css'
import {
  Alert,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'

function CreateGroupPage() {
  const navigate = useNavigate()

  // Lomakkeen tiedot sekä tallennuksen tila ja käyttäjälle näytettävät viestit.
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  // Käsittelee lomakkeen lähetyksen ja tekee pyynnön backendille.
  async function submit(event) {
    // Estetään lomakkeen oletustoiminto eli koko sivun uudelleenlataus.
    event.preventDefault()

    // Tyhjennetään edellisen yrityksen viestit.
    setError('')
    setSuccess('')

    // Poistetaan alun ja lopun välilyönnit, jotta pelkkä välilyönti ei kelpaa nimeksi.
    const cleanName = name.trim()

    if (cleanName === '') {
      setError('Ryhmän nimi ei voi olla tyhjä.')
      return
    }

    setSaving(true)

    // Lähetetään uuden ryhmän tiedot backendille.
    try {
      const response = await axios.post('/api/groups', {
        name: cleanName,
        visibility: visibility
      })

      // Backend palauttaa luodun ryhmän tiedot vastauksessa.
      const group = response.data.group

      setSuccess(`Ryhmä "${group.name}" luotiin.`)
      setName('')
    } catch (requestError) {
      let errorMessage = 'Ryhmän luonti epäonnistui.'

      // Jos backend palautti tarkemman virheviestin, näytetään se käyttäjälle.
      if (requestError.response && requestError.response.data) {
        const serverError = requestError.response.data.error

        if (typeof serverError === 'string') {
          errorMessage = serverError
        } else if (serverError && serverError.message) {
          errorMessage = serverError.message
        }
      }

      setError(errorMessage)
    } finally {
      // Tallennus päättyi riippumatta siitä, onnistuiko pyyntö vai ei.
      setSaving(false)
    }
  }

  // Painikkeen teksti kertoo, tallennetaanko ryhmää parhaillaan.
  let buttonText = 'Luo ryhmä'

  if (saving) {
    buttonText = 'Tallennetaan...'
  }

  return (
    <Container className="login-page" maxWidth="sm" sx={{ py: 6 }}>
      {/* Paper toimii lomakkeen taustakorttina. */}
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Luo ryhmä
        </Typography>

        {/* Stack asettelee lomakkeen kentät ja painikkeet pystysuuntaan. */}
        <Stack component="form" onSubmit={submit} spacing={2}>
          <TextField
            label="Ryhmän nimi"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />

          {/* Select antaa käyttäjän valita ryhmän näkyvyyden. */}
          <FormControl fullWidth>
            <InputLabel id="group-visibility-label">Näkyvyys</InputLabel>
            <Select
              labelId="group-visibility-label"
              label="Näkyvyys"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            >
              <MenuItem value="private">Yksityinen</MenuItem>
              <MenuItem value="public">Julkinen</MenuItem>
            </Select>
          </FormControl>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button type="submit" variant="contained" disabled={saving}>
              {buttonText}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Takaisin etusivulle
            </Button>
          </Stack>

          {/* Näytetään virhe- tai onnistumisviesti vain, jos sellainen on. */}
          {error && <Alert severity="error" role="alert">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </Paper>
    </Container>
  )
}

export default CreateGroupPage