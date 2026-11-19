
import { Button, MenuItem, Stack, TextField } from '@mui/material'

function EditMovieListForm({
  name,
  visibility,
  onNameChange,
  onVisibilityChange,
  onSave,
  onCancel,
  loading
}) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Listan nimi"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        inputProps={{ maxLength: 100 }}
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

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={loading || !name.trim()}
        >
          Tallenna muutokset
        </Button>

        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Peruuta
        </Button>
      </Stack>
    </Stack>
  )
}

export default EditMovieListForm
