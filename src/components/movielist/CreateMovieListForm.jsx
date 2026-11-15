
function CreateMovieListForm({
  name,
  visibility,
  saving,
  onNameChange,
  onVisibilityChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="list-name">Listan nimi</label>

      <input
        id="list-name"
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        maxLength={100}
        placeholder="Esim. Katsottavat elokuvat"
        required
      />

      <label htmlFor="list-visibility">Näkyvyys</label>

      <select
        id="list-visibility"
        value={visibility}
        onChange={(event) => onVisibilityChange(event.target.value)}
      >
        <option value="private">Yksityinen</option>
        <option value="public">Julkinen</option>
        <option value="unlisted">Linkillä jaettava</option>
      </select>

      <button type="submit" disabled={saving}>
        {saving ? 'Tallennetaan...' : 'Luo lista'}
      </button>
    </form>
  )
}

export default CreateMovieListForm
