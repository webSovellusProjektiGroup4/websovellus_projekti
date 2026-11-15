import { createGroup, getGroupsForUser, getGroupForUser, createGroupInvitation,
   getGroupMember, searchPublicGroups, getGroupMembers, addGroupMember, 
   findValidGroupInvitation, getGroupVisibility, createJoinRequest, getPendingJoinRequests,
  decideJoinRequest } from '../models/Group.js'
import crypto from 'node:crypto'

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

const getGroupsController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const groups = await getGroupsForUser(userId)

    return res.status(200).json({ groups })
  } catch (error) {
    next(error)
  }
}

const getGroupController = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)

    if (!Number.isInteger(groupId) || groupId < 1) {
      return res.status(400).json({
        error: 'Ryhmän id ei ole kelvollinen'
      })
    }

    const userId = req.user.id
    const group = await getGroupForUser(groupId, userId)

    if (group === null) {
      return res.status(404).json({
        error: 'Ryhmää ei löytynyt tai sinulla ei ole oikeutta nähdä sitä'
      })
    }
    const members = await getGroupMembers(groupId)
    return res.status(200).json({group: { ...group, members }}) //ryhmä löytyi
  } 
  catch (error) {
    next(error)
  }
}

const createGroupController = async (req, res, next) => {
  try {
    // Varmistetaan, että nimi on tekstiä, ja poistetaan alun ja lopun välilyönnit

    let name

    if (typeof req.body.name === 'string') { // tarkistetaan, että onko nimi tekstimudossa
        name = req.body.name.trim() // Poistetaan turhat välilyönnit. 
        
    } else {
        name = '' 
    }

    // Jos näkyvyyttä ei ite määritella niin oletuksena ryhmästä tullee privaatti
    const visibility = req.body.visibility ?? 'private'

    //ryhmän nimi ei voi olla tyhjä
    if (name.length === 0) {
      return res.status(400).json({
        error: 'Ryhmän nimi ei voi olla tyhjä'
      })
    }

        // eli tarkistetaan, että näkyvyys on varmasti joko public tai private, jos ei niin palautetaan virhe
    if (visibility !== 'public' && visibility !== 'private') {
      return res.status(400).json({
        error: 'Näkyvyyden pitää olla public tai private'
      })
    }

    // selvitetään käyttäjän id, joka on kirjautuneena. 
    const creatorId = req.user.id

    // tallennetaan ryhmä tietokantaan ja saahan takasin luotu ryhmä
    const group = await createGroup(name, visibility, creatorId)

    return res.status(201).json({ group }) // palautetaan, että ryhmä ois luotu onnistuneesti
    } 
    catch (error) { // jos tullee virhe, nii info mennee middlewaren virheenkäsittelijälle
    next(error)
  }


}


const createGroupInvitationController = async (req, res, next) => {
  try {
    const groupId = Number(req.body.groupId)

    if (!Number.isInteger(groupId) || groupId < 1) {
      return res.status(400).json({
        error: 'Ryhmän id ei ole kelvollinen'
      })
    }

    const userId = req.user.id

    // Hakee ryhmän, jos käyttäjä on sen jäsen: sisältää visibility- ja role-kentät
    const group = await getGroupForUser(groupId, userId)

    if (group?.role !== 'admin') {
      return res.status(403).json({ error: 'Vain ryhmän ylläpitäjä voi luoda kutsulinkin' })
    }

    // if (group.visibility === 'private') {
    //   return res.status(403).json({ error: 'Yksityiseen ryhmään ei voi luoda kutsulinkkiä' })
    // }

    //7 päivän expire
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const token = crypto.randomBytes(32).toString('base64url')


    const memberInvitation = await createGroupInvitation(groupId, userId, hashToken(token), expiresAt)
    return res.status(201).json({ memberInvitation, token })
  } 
  catch (error) {
    next(error)
  }
}

  const createMemberWithGroupInvitationLinkController = async (req, res, next) => {
      try {
    const userId = req.user.id
    const token = req.body.token
    if (typeof token !== 'string' || token.length === 0){
      return res.status(400).json({
        error: 'Linkin token ei ole oikeanmuotoinen'
      })
    }
    const tokenHash = hashToken(token)
    const invitation = await findValidGroupInvitation(tokenHash)

    if (invitation === null){
      return res.status(404).json({
        error: 'Kutsulinkki ei voimassa'
      })
    }
    const groupId = invitation.group_id
    const member = await getGroupMember(groupId, userId)
    if (member !== null) {
      //Member on jo ryhmässä
      return res.status(200).json({ status: 'member', groupId })
    }
    const visibility = await getGroupVisibility(groupId)
    
    //Jos group on julkinen
    if (visibility === 'public') {
      await addGroupMember(groupId, userId)
      return res.status(200).json({ status: 'member', groupId })
    }    
    // Yksityiselle
     await createJoinRequest(groupId, userId, invitation.id)
    return res.status(202).json({ status: 'pending' })
      } catch (error) {
      next(error)
    }
  }


  const searchPublicGroupsController = async (req, res, next) => {
      try {
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
      console.log(search)
      const groups = await searchPublicGroups(search, req.user?.id)

    return res.status(201).json({ groups })
      } catch (error) {
      next(error)
    }
  }

  
const joinPublicGroupController = async (req, res, next) => {
  try {
    const groupId = Number(req.params.id)
    if (!Number.isInteger(groupId) || groupId < 1) {
      return res.status(400).json({ error: 'Ryhmän id ei ole kelvollinen' })
    }


    // Vain julkiseen ryhmään voi liittyä ilman kutsua
    const visibility = await getGroupVisibility(groupId)
    if (visibility !== 'public') {
      return res.status(404).json({ error: 'Ryhmää ei löytynyt' })
    }
    await addGroupMember(groupId, req.user.id)
    return res.status(200).json({ groupId })
  } catch (error) {
    next(error)
  }
}

//PRIVATE GROUP
const getAdminGroupId = async (req, res) => {
  const groupId = Number(req.params.id)
  
  if (!Number.isInteger(groupId) || groupId < 0) {
    res.status(400).json({ error: 'Ryhmän id ei ole kelvollinen' })
    return null
  }
  const member = await getGroupMember(groupId, req.user.id)
  if (member?.role !== 'admin') {
    res.status(403).json({ error: 'Vain ryhmän ylläpitäjä voi käsitellä liittymispyyntöjä' })
    return null
  }
  return groupId

}

const getJoinRequestsController = async (req, res, next) =>{
  try {
    const groupId = await getAdminGroupId(req, res)
    if(groupId === null) return
    const requests = await getPendingJoinRequests(groupId)
    return res.status(200).json({requests})
  } catch (error) {
    next(error)
  }
}

const decideJoinRequestController = (status) => async(req, res, next) => {
  try {
    const groupId = await getAdminGroupId(req, res)
    if(groupId === null ) return

    const requestId = Number(req.params.requestId)
    if (!Number.isInteger(requestId) || requestId < 1) {
      return res.status(400).json({ error: 'Pyynnön id ei ole kelvollinen' })
    }

    const request = await decideJoinRequest(requestId, groupId, status, req.user.id)
    if(request === null){
      return res.status(404).json({error: 'Liittymispyyntöä ei löytynyt tai se on jo käsitelty'})
    }

    return res.status(200).json({status})
  } catch (error) {
    next(error)
  }
}

const approveJoinRequestController = decideJoinRequestController("approved")
const rejectJoinRequestController = decideJoinRequestController("rejected")



export { createGroupController, getGroupsController, 
  getGroupController, createGroupInvitationController ,
  createMemberWithGroupInvitationLinkController, searchPublicGroupsController,
  joinPublicGroupController, approveJoinRequestController, rejectJoinRequestController,
  getJoinRequestsController
}