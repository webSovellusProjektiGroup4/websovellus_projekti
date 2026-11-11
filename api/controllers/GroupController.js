import { createGroup, getGroupsForUser, getGroupForUser } from '../models/Group.js'


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

export { createGroupController, getGroupsController, getGroupController }