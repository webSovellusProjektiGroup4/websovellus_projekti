import { useState } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { Alert, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../providers/AuthProvider.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, login } = useAuth()
  const location = useLocation()
  const from = location.state?.from ?? '/'
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()

    if (e.target.password.value !== e.target.secondpassword.value) {
      setError('Annetut salasanat eivät täsmää')
      return
    }

    setError('')
    try {
      await register(e.target.username.value, e.target.password.value)
      await login(e.target.username.value, e.target.password.value)
      navigate(from, { replace: true })
    } catch (err) {
      // backend palauttaa virheen joko tekstinä tai objektina { message }
      const backendError = err.response?.data?.error
      setError(backendError?.message ?? backendError ?? 'Rekisteröityminen epäonnistui')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rekisteröidy
        </Typography>

        <Stack component="form" onSubmit={submit} spacing={2}>
          <TextField name="username" label="Käyttäjänimi" required autoComplete="username" />
          <TextField name="password" label="Salasana" type="password" required autoComplete="new-password" />
          <TextField name="secondpassword" label="Toista salasana" type="password" required autoComplete="new-password" />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained">
            Rekisteröidy
          </Button>
          <Button type="button" onClick={() => navigate('/', { replace: true })}>
            Takaisin etusivulle
          </Button>

          <Link component={RouterLink} to="/login" state={{ from }} textAlign="center">
            Onko sinulla jo tili? Kirjaudu
          </Link>
        </Stack>
      </Paper>
    </Container>
  )
}

export default RegisterPage
