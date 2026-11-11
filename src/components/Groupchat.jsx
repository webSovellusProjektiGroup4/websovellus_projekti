import { useState } from 'react';

function GroupChat({ groupId }) {
    const [text, setText] = useState('');

    const sendMessage = async () => {
        if (!text.trim()) return;

        await fetch(`http://localhost:3000/api/groups/${groupId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: text })
        });

        setText('');
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default GroupChat;