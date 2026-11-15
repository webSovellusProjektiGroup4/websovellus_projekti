import { Router } from 'express'
import requireAuth from '../middleware/requireAuth.js'
import { listMessages, sendMessage } from '../controllers/groupmessageController.js'

const router = Router()

router.get('/:groupId/messages', requireAuth, listMessages)
router.post('/:groupId/messages', requireAuth, sendMessage)

export default router