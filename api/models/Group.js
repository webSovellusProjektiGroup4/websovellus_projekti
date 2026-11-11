import { pool } from './db.js'

const createGroup = async (name, visibility, creatorId) => {
  const client = await pool.connect()

  try {
    // Aloitetaan transaktio
    await client.query('BEGIN')

    // Tallennetaan uusi ryhmä
    const groupResult = await client.query(
      `INSERT INTO groups (name, visibility, creator_id)
       VALUES ($1, $2, $3)
       RETURNING id, name, visibility, creator_id, created_at`,
      [name, visibility, creatorId]
    )

    // Otetaan talteen juuri luotu ryhmä ja sen tietokannan antama id
    const group = groupResult.rows[0]

    // Lisätään ryhmän luoja ryhmään ylläpitäjäksi
    await client.query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [group.id, creatorId]
    )

    // Molemmat tallennukset onnistuivat, joten vahvistetaan ne
    await client.query('COMMIT')

    return group
  } catch (error) {
    // Jos jokin epäonnistui, perutaan transaktio
    await client.query('ROLLBACK')

    // Välitetään virhe seuraavan koodikerroksen käsiteltäväksi
    throw error
  } finally {
    // Palautetaan yhteys pooliin aina, myös virhetilanteessa
    client.release()
  }
}

const getGroupsForUser = async (userId) => {
  const result = await pool.query(
    `SELECT
       groups.id,
       groups.name,
       groups.visibility,
       groups.creator_id,
       groups.created_at,
       group_members.role
     FROM groups
     INNER JOIN group_members
       ON groups.id = group_members.group_id
     WHERE group_members.user_id = $1
     ORDER BY groups.created_at DESC`,
    [userId]
  )

  return result.rows
}

const getGroupForUser = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT
       groups.id,
       groups.name,
       groups.visibility,
       groups.creator_id,
       groups.created_at,
       group_members.role
     FROM groups
     INNER JOIN group_members
       ON groups.id = group_members.group_id
     WHERE groups.id = $1
       AND group_members.user_id = $2`,
    [groupId, userId]
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export { createGroup, getGroupsForUser, getGroupForUser }