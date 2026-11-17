
import { useState } from 'react'
import './LoginAndRegisterPage.css'
import { useAuth } from '../providers/AuthProvider.jsx'
import { useNavigate,useLocation, Link as RouterLink } from 'react-router-dom'
import { Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material'



function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const from = location.state?.from ?? '/' 

  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(e.target.username.value, e.target.password.value)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Kirjautuminen epäonnistui')
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>

        <Typography variant="h4" component="h1" gutterBottom>
          Kirjaudu
        </Typography>
        <Stack component="form" onSubmit={submit} spacing={2}>

          <TextField name="username" label="Käyttäjänimi" required autoComplete="username" />
          <TextField name="password" label="Salasana" type="password" required autoComplete="password" />
          <Button type="submit" variant = "contained" >
            Kirjaudu
          </Button>
          <Button type="button" onClick={() => navigate('/', { replace: true })}>
            Takaisin etusivulle
          </Button>

          <Link component={RouterLink} to="/register" state={{ from }}  textAlign="center">Eikö sinulla ole tiliä? Rekisteröidy</Link>
        </Stack>
      </Paper>
    </Container>
  )
}

export default LoginPage
