import { Router } from 'express'
import {createGroupController, getGroupController, getGroupsController, createGroupInvitationController,
     createMemberWithGroupInvitationLinkController, searchPublicGroupsController,
     joinPublicGroupController, getJoinRequestsController, approveJoinRequestController, 
     rejectJoinRequestController
} from '../controllers/GroupController.js'
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
router.get('/:id/join-requests', requireAuth, getJoinRequestsController)
router.post('/:id/join-requests/:requestId/approve', requireAuth, approveJoinRequestController)
router.post('/:id/join-requests/:requestId/reject', requireAuth, rejectJoinRequestController)


export default router