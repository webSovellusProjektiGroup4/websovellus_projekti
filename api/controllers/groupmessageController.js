import { isGroupMember, getMessages, addMessage, getMoviePosts, addMoviePost } from '../models/groupmessage.js'
import { fetchMovieDetails } from '../services/movieService.js'

// Haetaan jaetun elokuvan nimi ja juliste. Jos TMDB ei vastaa, näytetään pelkkä tunniste.
const withMovieDetails = async (post) => {
  try {
    const details = await fetchMovieDetails(post.tmdb_id)
    return { ...post, movie: details }
  } catch (error) {
    console.error(`Elokuvan ${post.tmdb_id} tietojen haku epäonnistui:`, error.message)
    return { ...post, movie: { tmdb_id: post.tmdb_id, title: `Elokuva ${post.tmdb_id}`, poster_path: null } }
  }
}

// Palauttaa ryhmän keskustelun: tekstiviestit (type 'message') ja jaetut elokuvat (type 'movie')
// samassa listassa aikajärjestyksessä
const listMessages = async (req, res) => {
  try {
    if (!(await isGroupMember(req.params.groupId, req.user.id)))
      return res.status(403).json({ error: 'Et ole ryhmän jäsen' })

    const [messages, posts] = await Promise.all([
      getMessages(req.params.groupId),
      getMoviePosts(req.params.groupId)
    ])

    const moviePosts = await Promise.all(posts.map(withMovieDetails))

    const timeline = [
      ...messages.map((message) => ({ ...message, type: 'message' })),
      ...moviePosts.map(({ tmdb_id: _tmdbId, ...post }) => ({ ...post, type: 'movie' }))
    ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    res.json(timeline)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const sendMessage = async (req, res) => {
  try {
    if (!req.body.content?.trim())
      return res.status(400).json({ error: 'Viesti ei voi olla tyhjä' })

    if (!(await isGroupMember(req.params.groupId, req.user.id)))
      return res.status(403).json({ error: 'Et ole ryhmän jäsen' })

    const message = await addMessage(req.params.groupId, req.user.id, req.body.content.trim())
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Jakaa elokuvan ryhmään (group_posts). Body: { tmdbId, comment? }
// comment on jakajan valinnainen viesti, joka tallennetaan jaon kommentiksi (group_comments)
const shareMovie = async (req, res) => {
  try {
    const tmdbId = Number(req.body?.tmdbId)
    if (!Number.isInteger(tmdbId) || tmdbId <= 0)
      return res.status(400).json({ error: 'Virheellinen elokuvan tunniste' })

    const comment = typeof req.body?.comment === 'string' && req.body.comment.trim() !== ''
      ? req.body.comment.trim()
      : null

    if (!(await isGroupMember(req.params.groupId, req.user.id)))
      return res.status(403).json({ error: 'Et ole ryhmän jäsen' })

    // Varmistetaan, että elokuva on olemassa ennen tallennusta
    let movie
    try {
      movie = await fetchMovieDetails(tmdbId)
    } catch (error) {
      if (error.status === 404)
        return res.status(400).json({ error: 'Elokuvaa ei löytynyt' })
      throw error
    }

    const post = await addMoviePost(req.params.groupId, req.user.id, tmdbId, comment)
    res.status(201).json({ ...post, username: req.user.username, type: 'movie', movie })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { listMessages, sendMessage, shareMovie }
