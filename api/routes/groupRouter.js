import { Router } from 'express'
import {createGroupController, getGroupController, getGroupsController, createGroupInvitationController, createMemberWithGroupInvitationLinkController } from '../controllers/GroupController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, getGroupsController)
router.get('/:id', requireAuth, getGroupController)
router.post('/', requireAuth, createGroupController)
router.post('/createGroupInvitation', requireAuth, createGroupInvitationController)
router.post('/createMemberWithInvitation', requireAuth, createMemberWithGroupInvitationLinkController)

export default router