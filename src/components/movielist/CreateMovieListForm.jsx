
import { Button, MenuItem, Stack, TextField } from '@mui/material'

function CreateMovieListForm({
  name,
  visibility,
  saving,
  onNameChange,
  onVisibilityChange,
  onSubmit
}) {
  return (
    <Stack component="form" onSubmit={onSubmit} spacing={2}>
      <TextField
        label="Listan nimi"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        inputProps={{ maxLength: 100 }}
        placeholder="Esim. Katsottavat elokuvat"
        required
        fullWidth
      />

      <TextField
        select
        label="Näkyvyys"
        value={visibility}
        onChange={(event) => onVisibilityChange(event.target.value)}
        fullWidth
      >
        <MenuItem value="private">Yksityinen</MenuItem>
        <MenuItem value="public">Julkinen</MenuItem>
        <MenuItem value="unlisted">Linkillä jaettava</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" disabled={saving}>
        {saving ? 'Tallennetaan...' : 'Luo lista'}
      </Button>
    </Stack>
  )
}

export default CreateMovieListForm
