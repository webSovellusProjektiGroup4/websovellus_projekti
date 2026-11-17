import { createTheme } from '@mui/material/styles'

// Sovelluksen yhteinen MUI-teema. Värit, fontit ja muotoilut määritellään täällä kerran,
// ja kaikki MUI-komponentit käyttävät niitä automaattisesti.
const theme = createTheme({
  // Vaalea ja tumma tila: MUI valitsee käyttöjärjestelmän asetuksen mukaan
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#e8892b', contrastText: '#1e1e1e' },
        secondary: { main: '#2f6fb3' },
        background: { default: '#f6f6f8', paper: '#ffffff' }
      }
    },
    dark: {
      palette: {
        primary: { main: '#f0a24a', contrastText: '#1e1e1e' },
        secondary: { main: '#6aa6ea' },
        background: { default: '#141414', paper: '#1e1e1e' }
      }
    }
  },

  shape: {
    borderRadius: 8
  },

  typography: {
    fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',  // napeissa normaali kirjainkoko (MUI:n oletus on ISOT KIRJAIMET)
      fontWeight: 600
    }
  },

  components: {
    // Napit ilman varjoa, jotta ulkoasu pysyy kevyenä
    MuiButton: {
      defaultProps: { disableElevation: true }
    },
    // Lomakekentät koko leveydelle ja pienemmällä korkeudella oletuksena
    MuiTextField: {
      defaultProps: { fullWidth: true, size: 'small' }
    }
  }
})

export default theme
