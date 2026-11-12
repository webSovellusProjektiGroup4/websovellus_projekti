import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'
import GroupInvitation from '../components/GroupInvitation.jsx'

function GroupDetailPage() {

    // löytää reitistö ryhmän id:n perusteella
  const { id } = useParams()
  const navigate = useNavigate()

    //asetetaan tilat ryhmän tiedoille, lataukselle sekä mahdolliselle virheelle
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchGroup() {
      setLoading(true)
      setError('')
    
      try {
        //hakee ryhmän tietoja id:n perusteella
        const response = await axios.get(`/api/groups/${id}`)
        setGroup(response.data.group)
      } 
      //jos ryhmää ei löydy
      catch (requestError) {
        if (
          requestError.response &&
          requestError.response.status === 404
        ) {
          setError('Ryhmää ei löytynyt tai sinulla ei ole oikeutta nähdä sitä.')
        } else {
          setError('Ryhmän hakeminen epäonnistui.')
        }
      } finally {
        setLoading(false)
      }
    }

    //kutsuu funktiota, joka hakee ryhmän tiedot
    fetchGroup()
  }, [id])

  let pageContent

  if (loading) {
    pageContent = <p>Ladataan ryhmää...</p>
  } else if (error !== '') {
    pageContent = <p role="alert">{error}</p>
  } else if (group === null) {
    pageContent = <p>Ryhmän tietoja ei löytynyt.</p>
  } else {
    pageContent = (
      <>
        <h1>{group.name}</h1>
        <p>Näkyvyys: {groupVisibilityText(group.visibility)}</p>
        <p>Roolisi ryhmässä: {group.role}</p>
        {group.role === 'admin' && <GroupInvitation groupId={group.id} visibility={group.visibility} />}
        <br></br>
        <p>Jäsenet</p>
        <ul>
          {group.members.map((member)=>{
            return (
              <li>{member.username} ({member.role}, {new Date(member.joined_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })})</li>
            )
          })}
        </ul>
      
      </>
    )
  }

    //näytettään sivu, jossa on ryhmän tiedot sekä palaa ryhmiin nappi
  return (
    <main>
      {pageContent}

      <button type="button" onClick={() => navigate('/groups')}>
        Palaa ryhmiin
      </button>
    </main>
  )
}

export default GroupDetailPage