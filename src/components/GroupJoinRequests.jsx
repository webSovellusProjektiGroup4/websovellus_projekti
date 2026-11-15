import { useEffect, useState } from 'react'
import axios from 'axios'


function GroupJoinRequests({ groupId, onMemberAdded  }) {
  const [requests, setRequests] = useState([])
    const [error, setError] = useState('')


    useEffect(() => {
        
        async function getRequests() {
            try {
                const response = await axios.get(`/api/groups/${groupId}/join-requests`)
                setRequests(response.data.requests)
            } catch (requestError) {
                setError(requestError.response?.data?.error ?? "Virhe pyyntöjä hakiessa")
            }
        }

        getRequests()
    },[groupId])

    const decideJoinRequest = async (status, requestId)=>{
        try{
             await axios.post(`/api/groups/${groupId}/join-requests/${requestId}/${status}`)
            setRequests((previous) => previous.filter((request) => request.id !== requestId))
            if(status === "approve"){

                onMemberAdded ()
            }
        } catch (error) {
            setError(error.response?.data?.error ?? "Virhe hyväksyessä tai hylätessä pyyntöä")
        }

    }


  return (
    <section>
      <h2>Liittymispyynnöt ({requests.length})</h2>

      {error && <p role="alert">{error}</p>}

      {requests.length === 0 ? (
        <p>Ei avoimia liittymispyyntöjä.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              {request.username}
              {' – '}
              {new Date(request.created_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}
              {' '}
              <button type="button" onClick={() => decideJoinRequest('approve', request.id)}>
                Hyväksy
              </button>
              <button type="button" onClick={() => decideJoinRequest('reject', request.id)}>
                Hylkää
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default GroupJoinRequests
