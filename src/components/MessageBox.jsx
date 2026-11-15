import './MessageBox.css'

function MessageBox({ message, user }) {
  
  return (
    
    <div className= {user.username === message.username ? 'message-box-same-user': 'message-box-user'}> 
        <p className="message-author">{message.username}</p>
<p>{message.content}</p>
<p className="message-time">{new Date(message.created_at).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}</p>
    </div>
  )
}

export default MessageBox