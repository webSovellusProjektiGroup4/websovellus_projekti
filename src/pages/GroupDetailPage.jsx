import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import groupVisibilityText from '../utils/groupVisibilityText.js'
import GroupInvitation from '../components/GroupInvitation.jsx'
import GroupChat from '../components/GroupChat.jsx'
import GroupJoinRequests from '../components/GroupJoinRequests.jsx'
import './GroupDetailPage.css'
import { Button, List, ListItem, ListItemText } from '@mui/material'

function GroupDetailPage() {

    // löytää reitistö ryhmän id:n perusteella
  const { id } = useParams()
  const navigate = useNavigate()
   const dialogRef = useRef(null)


    //asetetaan tilat ryhmän tiedoille, lataukselle sekä mahdolliselle virheelle
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [groupManagementOpen , setGroupManagementOpen] = useState (false)
  const [error, setError] = useState('')

  useEffect(()=>{
    if(groupManagementOpen && dialogRef.current && !dialogRef.current.open){
      dialogRef.current.showModal()
    }
  }, [groupManagementOpen])

  useEffect(() => {
    
    //kutsuu funktiota, joka hakee ryhmän tiedot (sivun avautuessa lataustilan kanssa)
    fetchGroup(true)
  }, [id])


  async function fetchGroup(showLoading = false) {
      if (showLoading) {
        setLoading(true)
        setError('')
      }

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
        <div className='group-detail'>

        <h2>{group.name}</h2>
        <p>Näkyvyys: {groupVisibilityText(group.visibility)}</p>
        <p>Roolisi ryhmässä: {group.role}</p>
        {
          group.role == "admin" ? 
          <Button variant="outlined" onClick={() => setGroupManagementOpen(true)}>
                 Hallinnoi ryhmää
          </Button>
          : null
        }
        </div>
        <div className='group-chat'>

        <h2>Keskustelu</h2>
        <GroupChat groupId={group.id} />
        </div>
     <div className='members-list'>
       <h2>Jäsenet</h2>
           <List dense disablePadding>
              {group.members.map((member) => (
             <ListItem key={member.id ?? member.username} disableGutters>
               <ListItemText
                primary={member.username}
                  secondary={`${member.role} · liittynyt ${new Date(member.joined_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}`}
            />
      </ListItem>
    ))}
  </List>
</div>

        { groupManagementOpen ? 

          <dialog ref={dialogRef} onClose={()=>setGroupManagementOpen(false)}>
            <GroupJoinRequests groupId = {group.id} onMemberAdded  = {fetchGroup}></GroupJoinRequests>
            {group.role === 'admin' && <GroupInvitation groupId={group.id} visibility={group.visibility} />}
            <Button onClick={() => setGroupManagementOpen(false)}>Sulje</Button>

          </dialog> : null
        }


      </>
    )
  }

    //näytettään sivu, jossa on ryhmän tiedot sekä palaa ryhmiin nappi
  return (
    <main className='group-page'>
      {pageContent}

      <Button variant="text" onClick={() => navigate('/groups')}>
        ← Palaa ryhmiin
      </Button>
    </main>
  )
}

export default GroupDetailPage