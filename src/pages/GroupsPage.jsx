import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'
import { useAuth } from '../providers/AuthProvider.jsx'


function GroupsPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [groups, setGroups] = useState([])
  const [publicGroups, setPublicGroups] = useState(undefined)
  const [publicGroupSearch, setPublicGroupSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')  //Omat ryhmät virhe
  const [publicError, setPublicError] = useState('') // Julkiset ryhmät haku virhe

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      setGroups([])
      setLoading(false)
      return
    }

    async function fetchGroups() {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/groups')
        setGroups(response.data.groups)

        //Jos epäonnistuu
      } catch {
        setError('Ryhmien hakeminen epäonnistui.')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [authLoading, user])

  async function fetchPublicGroups() {
    setPublicError('')
    try {
      const response = await axios.get('/api/groups/public', {
        params: { search: publicGroupSearch }
      })
      setPublicGroups(response.data.groups)
    } catch {
      setPublicError('Julkisten ryhmien haku epäonnistui.')
    }
  }

  async function joinGroup(groupId) {
    setPublicError('')
    try {
      await axios.post(`/api/groups/${groupId}/join`)
      navigate(`/groups/${groupId}`)
    } catch {
      setPublicError('Ryhmään liittyminen epäonnistui.')
    }
  }

  function goToLogin() {
    navigate('/login', { state: { from: location.pathname } })
  }

  let pageContent

  if (authLoading || loading) {
    pageContent = <p>Ladataan ryhmiä...</p>
  } else if (!user) {
    pageContent = (
      <p>
        <button type="button" onClick={goToLogin}>Kirjaudu</button> nähdäksesi omat ryhmäsi.
      </p>
    )
  } else if (error !== '') {
    pageContent = <p role="alert">{error}</p>
  } else if (groups.length === 0) {
    pageContent = <p>Sinulla ei ole vielä ryhmiä.</p>
  } else {

    //käydään omat ryhmät läpi ja näytetään ne listana
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

  //näytettään sivu, jossa on omat ryhmät, julkisten ryhmien haku sekä palaa etusivulle nappi
  return (
    <main>
      <h1>Omat ryhmät</h1>

      {pageContent}
      <br/>
      <h2>Julkiset ryhmät</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()        // estää sivun uudelleenlatauksen
          fetchPublicGroups()
        }}
      >

      <label>Etsi julkisia ryhmiä{' '}
        <input
          name="public-group"
          value={publicGroupSearch}
          onChange={(e) => setPublicGroupSearch(e.target.value)}
        />
      </label>

      <button type="button" onClick={fetchPublicGroups}>
        Hae
      </button>
      </form>

     {publicError && <p role="alert">{publicError}</p>}

      {publicGroups !== undefined && (
        publicGroups.length === 0 ? (
          <p>Julkisia ryhmiä ei löytynyt hakusanalla.</p>
        ) : (
          <ul>
            {publicGroups.map((group) => (
              <li key={group.id}>
                {group.is_member
                  ? <Link to={`/groups/${group.id}`}>{group.name}</Link>
                  : <span>{group.name}</span>}
                {' · '}{group.member_count} jäsentä{' '}
                {group.is_member && <span>(olet jäsen)</span>}
                {user && !group.is_member && (
                  <button type="button" onClick={() => joinGroup(group.id)}>Liity ryhmään</button>
                )}
                {!user && (
                  <button type="button" onClick={goToLogin}>Kirjaudu liittyäksesi</button>
                )}
              </li>
            ))}
          </ul>
        )
      )}


      <br/>

      <button type="button" onClick={() => navigate('/')}>
        Palaa etusivulle
      </button>
    </main>
  )
}

export default GroupsPage
