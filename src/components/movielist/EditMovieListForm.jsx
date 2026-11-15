
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
    <div>
      <input
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        aria-label="Muokkaa listan nimeä"
        maxLength={100}
      />

      <select
        value={visibility}
        onChange={(event) =>
          onVisibilityChange(event.target.value)
        }
        aria-label="Muokkaa listan näkyvyyttä"
      >
        <option value="private">Yksityinen</option>
        <option value="public">Julkinen</option>
        <option value="unlisted">Linkillä jaettava</option>
      </select>

      <button
        type="button"
        onClick={onSave}
        disabled={loading || !name.trim()}
      >
        Tallenna muutokset
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
      >
        Peruuta
      </button>
    </div>
  )
}

export default EditMovieListForm
