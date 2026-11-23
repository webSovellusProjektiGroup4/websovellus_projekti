import { NavLink, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Toolbar, Typography, Grid } from '@mui/material'
import { useAuth } from '../providers/AuthProvider.jsx'
import MovieSearch from '../components/MovieSearch.jsx'

function Navbar() {
  const navigate = useNavigate()

  const { user, logout } = useAuth()
  const handleSearch = async (query) => {
    const trimmed = query.trim()
    navigate(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : '/')
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* <Typography variant="h6" sx={{ mr: 3 }}>Elokuvahaku</Typography> */}

        <Button component={NavLink} to="/" color="inherit">Etusivu</Button>
        <Button component={NavLink} to="/groups" color="inherit">Ryhmät</Button>
        <Button component={NavLink} to="/lists" color="inherit">Omat listat</Button>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          <MovieSearch onSearch={handleSearch} />
        </Box>

        {user
          ? <Button color="inherit" onClick={logout}>Kirjaudu ulos ({user.username})</Button>
          : <>

            <Button color="inherit" onClick={() => navigate('/login')}>Kirjaudu</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Rekisteröidy</Button>

          </>
        }

      </Toolbar>
    </AppBar>
  )
}

export default Navbar
