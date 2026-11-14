import { Router } from 'express'
import {createGroupController, getGroupController, getGroupsController, createGroupInvitationController,
     createMemberWithGroupInvitationLinkController, searchPublicGroupsController,
     joinPublicGroupController} from '../controllers/GroupController.js'
import requireAuth from '../middleware/requireAuth.js'
import optionalAuth from '../middleware/optionalAuth.js'


const router = Router()

router.get('/', requireAuth, getGroupsController)
router.get('/public', optionalAuth, searchPublicGroupsController)
router.get('/:id', requireAuth, getGroupController)
router.post('/', requireAuth, createGroupController)
router.post('/:id/join', requireAuth, joinPublicGroupController)
router.post('/createGroupInvitation', requireAuth, createGroupInvitationController)
router.post('/createMemberWithInvitation', requireAuth, createMemberWithGroupInvitationLinkController)

export default router