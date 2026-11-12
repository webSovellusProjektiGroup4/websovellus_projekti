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

const getGroupMember = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  )
  return result.rows[0] ?? null
}

const createGroupInvitation = async (groupId, invitedBy, tokenHash, expiresAt) => {
    const client = await pool.connect()
    
  try {
    // Aloitetaan transaktio
    await client.query('BEGIN')

  const result = await client.query(
    `INSERT INTO group_invitations (group_id, invited_by, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, group_id, expires_at`,
    [groupId, invitedBy, tokenHash, expiresAt]
  )
  await client.query('COMMIT')

  return result.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const findValidGroupInvitation = async (tokenHash) => {
  const result = await pool.query(
    `SELECT id, group_id FROM group_invitations
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND (expires_at IS NULL OR expires_at > now())`,
    [tokenHash]
  )
  return result.rows[0] ?? null
}

const addGroupMember = async (groupId, userId) => {
  const client = await pool.connect()
    
  try {
    await client.query('BEGIN')
//TÄmä onsert tarkistaa myös ettei tee mitään jos käyttäjä on jo ryhmssä
    const result = await client.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)
      ON CONFLICT (group_id, user_id) DO NOTHING
      RETURNING id`,
      [groupId, userId]
    )
        await client.query('COMMIT')

    return result.rows[0] ?? null
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
export { createGroup, getGroupsForUser, getGroupForUser, createGroupInvitation, findValidGroupInvitation, addGroupMember, getGroupMember}