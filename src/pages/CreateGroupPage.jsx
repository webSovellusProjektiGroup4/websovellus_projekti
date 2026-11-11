import { useState } from 'react'
import axios from 'axios'   //voidaan tehdä http pyyntöjä backendille
import { useNavigate } from 'react-router-dom'
import './LoginAndRegisterPage.css'

function CreateGroupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  // async on täällä axios pyynnön takia
  async function submit(event) {
    event.preventDefault()

    // Aina ennen uutta yritystä tyhjennetään viestit ja laitetaan tallennustila päälle
    setError('')
    setSuccess('')

    //varmistetaan, että ryhmän nimi ei ole tyhjä, trim poistaa välilyönnit alusta ja lopusta
    const cleanName = name.trim()

    if (cleanName === '') {
      setError('Ryhmän nimi ei voi olla tyhjä.')
      return
    }

    setSaving(true)

    //Lähetetään pyyntö backendille, että luotais uus ryhmä
    try {
      const response = await axios.post('/api/groups', {
        name: cleanName,
        visibility: visibility
      })

      const group = response.data.group

      setSuccess(`Ryhmä "${group.name}" luotiin.`)
      setName('')
    } catch (requestError) {
      let errorMessage = 'Ryhmän luonti epäonnistui.'

      // Tarkistetaan, onko virheestä saatavilla lisätietoa backendiltä
      if (requestError.response && requestError.response.data) {
        const serverError = requestError.response.data.error

        //Virhe voidaan palauttaa joko stringinä tai oliona, tarkistetaan kumpi on kyseessä
        if (typeof serverError === 'string') {
          errorMessage = serverError
        } else if (serverError && serverError.message) {
          errorMessage = serverError.message
        }
      }

      // Asetetaan virheviesti tilaan, jotta se voidaan näyttää käyttäjälle.
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  let errorParagraph = null

  if (error !== '') {
    errorParagraph = <p role="alert">{error}</p>
  }

  let successParagraph = null

  if (success !== '') {
    successParagraph = <p>{success}</p>
  }

  let buttonText = 'Luo ryhmä'

  if (saving) {
    buttonText = 'Tallennetaan...'
  }

  return (
    <div className="login-page">
      <h1>Luo ryhmä</h1>

      {/* Lomake ryhmän luomista varten, kenttää ei voi jättää tyhjäksi, koska is required. */}
      <form onSubmit={submit}>
        <label>
          Ryhmän nimi
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onInvalid={(event) => {
              event.target.setCustomValidity(
                'Ryhmän nimi ei voi olla tyhjä.'
              )
            }}
            onInput={(event) => {
              event.target.setCustomValidity('')
            }}
            required
          />
        </label>

        <label>
          Näkyvyys
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
          >
            <option value="private">Yksityinen</option>
            <option value="public">Julkinen</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {buttonText}
        </button>

        <button type="button" onClick={() => navigate('/')}>
          Takaisin etusivulle
        </button>
      </form>

      {/*lopuksi lähetetään viestit sivulle*/}
      {errorParagraph}
      {successParagraph}
    </div>
  )
}

export default CreateGroupPage