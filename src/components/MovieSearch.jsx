
import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

function MovieSearch({ onSearch }) {
  const [searchText, setSearchText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const query = searchText.trim()

    if (query) {
      onSearch(query)
    }
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        width: '100%',
        maxWidth: 550,
        mx: 'auto',
        mb: 4
      }}
    >
      <TextField
        label="Hae elokuvaa"
        placeholder="Kirjoita elokuvan nimi..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ px: 4 }}
      >
        Hae
      </Button>
    </Stack>
  )
}

export default MovieSearch
