import { Router } from 'express'
import {createGroupController, getGroupController, getGroupsController } from '../controllers/GroupController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.get('/', requireAuth, getGroupsController)
router.get('/:id', requireAuth, getGroupController)
router.post('/', requireAuth, createGroupController)

export default router