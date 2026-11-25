import { isGroupMember, getMessages, addMessage } from '../models/groupmessage.js'

const listMessages = async (req, res) => {
    try {
        if (!(await isGroupMember(req.params.groupId, req.user.id)))
            return res.status(403).json({ error: 'Et ole ryhmän jäsen' })

        const messages = await getMessages(req.params.groupId)
        res.json(messages)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        if (!req.body.content?.trim())
            return res.status(400).json({ error: 'Viesti ei voi olla tyhjä' })

        if (!(await isGroupMember(req.params.groupId, req.user.id)))
            return res.status(403).json({ error: 'Et ole ryhmän jäsen' })

        const message = await addMessage(req.params.groupId, req.user.id, req.body.content.trim())
        res.status(201).json(message)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export { listMessages, sendMessage }  