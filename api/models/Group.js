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

const searchPublicGroups = async (search, userId) => {
  const result = await pool.query(
    `SELECT g.id,
            g.name,
            (SELECT COUNT(*)::int
             FROM group_members gm
             WHERE gm.group_id = g.id) AS member_count,
            EXISTS (SELECT 1
                    FROM group_members gm
                    WHERE gm.group_id = g.id AND gm.user_id = $2) AS is_member
     FROM groups g
     WHERE g.visibility = 'public'
       AND g.name ILIKE '%' || $1 || '%'
     ORDER BY member_count DESC, g.name
     LIMIT 50`,
    [search, userId ?? null]
  )
  return result.rows
}





const getGroupMembers = async (groupId) => {
  const result = await pool.query(
    `SELECT users.id, users.username, group_members.role, group_members.joined_at
     FROM group_members
     INNER JOIN users ON users.id = group_members.user_id
     WHERE group_members.group_id = $1
     ORDER BY group_members.role = 'admin' DESC, users.username`,
    [groupId]
  )
  return result.rows
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
//TÄmä insert tarkistaa myös ettei tee mitään jos käyttäjä on jo ryhmssä
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

const getGroupVisibility = async (groupId) => {
  const result = await pool.query(
    'SELECT visibility FROM groups WHERE id = $1',
    [groupId]
  )
  return result.rows[0]?.visibility ?? null   
}

//PRIVATE GROUP funktiot
const createJoinRequest = async (groupId, userId, invitationId) => {
   const client = await pool.connect()
    
  try {
    // Aloitetaan transaktio
    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO group_join_requests (group_id, user_id, invitation_id)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
      RETURNING id`,
      [groupId, userId, invitationId]
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

const getPendingJoinRequests = async (groupId) => {
  const result = await pool.query(
    `SELECT r.id, r.created_at, u.id AS user_id, u.username
     FROM group_join_requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.group_id = $1 AND r.status = 'pending'
     ORDER BY r.created_at`,
    [groupId]
  )
  return result.rows
}

const decideJoinRequest = async (requestId, groupId, status, adminId) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const result = await client.query(
      `UPDATE group_join_requests
       SET status = $3, decided_at = now(), decided_by = $4
       WHERE id = $1 AND group_id = $2 AND status = 'pending'
       RETURNING user_id`,
      [requestId, groupId, status, adminId]
    )

    const request = result.rows[0]
    if (!request) {
      await client.query('ROLLBACK')
      return null    // ei löytynyt  tai toisen ryhmän tai on jo käsitelty
    }

    // Hyväksytty → lisätään jäseneksi samassa transaktiossa
    if (status === 'approved') {
      await client.query(
        `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)
         ON CONFLICT (group_id, user_id) DO NOTHING`,
        [groupId, request.user_id]
      )
    }

    await client.query('COMMIT')
    return request
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}




export { createGroup, getGroupsForUser, getGroupForUser, createGroupInvitation, 
  findValidGroupInvitation, addGroupMember, getGroupMember, getGroupMembers, 
  searchPublicGroups, getGroupVisibility, createJoinRequest, getPendingJoinRequests,
  decideJoinRequest}