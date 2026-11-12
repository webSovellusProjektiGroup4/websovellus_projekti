import { createGroup, getGroupsForUser, getGroupForUser, createGroupInvitation, getGroupMember,  addGroupMember, findValidGroupInvitation } from '../models/Group.js'
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
    return res.status(200).json({ group }) //ryhmä löytyi
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

    // Vain ryhmän admin saa luoda kutsulinkin
    const member = await getGroupMember(groupId, userId)
    if (member?.role !== 'admin') {
        return res.status(403).json({ error: 'Vain ryhmän ylläpitäjä voi luoda kutsulinkin' })
      }

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
// console.log(invitation)
    if (invitation === null){
      return res.status(400).json({
        error: 'Kutsulinkki ei voimassa'
      })
    }
    const createdGroupMember = await addGroupMember(invitation.group_id, userId)
    // console.log(createdGroupMember)
    return res.status(201).json({ createdGroupMember,  groupId: invitation.group_id })
      } catch (error) {
      next(error)
    }
  }



export { createGroupController, getGroupsController, getGroupController, createGroupInvitationController ,createMemberWithGroupInvitationLinkController}