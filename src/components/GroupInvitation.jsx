import { useEffect, useState } from 'react'
import axios from 'axios'


// Ryhmän adminille: luo kutsulinkin ja näyttää sen kopioitavaksi
const GroupInvitation =  ({ groupId }) => {
  const [inviteLink, setInviteLink] = useState('')
  const [error, setError] = useState('')

  const createInvitation = async()=>{

    try {
      const response = await axios.post('/api/groups/createGroupInvitation', {
        groupId: groupId
      })

      setInviteLink(`${window.location.origin}/join/${response.data.token}`)
      //Jos epäonnistuu
    } catch (requestError) {
      setError('Linkin luonti epäonnistui.')
    }

  }

  return (
    <section>
      <button type="button" onClick={createInvitation}>Luo kutsulinkki</button>

      {inviteLink && (
        <div>
          <input value={inviteLink} readOnly />
          <button type="button" onClick={() => navigator.clipboard.writeText(inviteLink)}>Kopioi linkki</button>
          <p>Linkki on voimassa 7 päivää.</p>
        </div>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default GroupInvitation
