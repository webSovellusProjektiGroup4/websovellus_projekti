import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'

function GroupsPage() {
  const navigate = useNavigate()

  //laitetaan kaikki tilat valmiiksi, että voidaan näyttää ryhmät, ladata ne ja mahdollinen virhe
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')  //Mahdollinen virhe

    //Kun sivu avautuu niin haetaan ryhmät
  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await axios.get('/api/groups')
        setGroups(response.data.groups)

        //Jos epäonnistuu
      } catch (requestError) {
        setError('Ryhmien hakeminen epäonnistui.')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  let pageContent

  if (loading) {
    pageContent = <p>Ladataan ryhmiä...</p>
  } else if (error !== '') {
    pageContent = <p role="alert">{error}</p> //näytettään poikkeustilanteessa, jos esim virheviesti on tyhjä
  } else if (groups.length === 0) {
    pageContent = <p>Sinulla ei ole vielä ryhmiä.</p>
  } else {

    //käydään ryhmät läpi ja näytetään ne listana
    pageContent = (
      <ul>
        {groups.map((group) => (
          <li key={group.id}> 
            <Link to={`/groups/${group.id}`}>{group.name}</Link> ({groupVisibilityText(group.visibility)})
          </li>
        ))}
      </ul>
    )
  }

  //näytettään sivu, jossa on ryhmät sekä palaa etusivulle nappi
  return (
    <main>
      <h1>Omat ryhmät</h1>

      {pageContent}

      <button type="button" onClick={() => navigate('/')}>
        Palaa etusivulle
      </button>
    </main>
  )
}

export default GroupsPage