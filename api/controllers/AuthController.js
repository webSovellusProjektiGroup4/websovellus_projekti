import { register, login, createToken, cookieOptions, cookieName } from '../services/authService.js'



const registerController = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await register(username, password)
    res.status(201).json({ id: user.id, username: user.username })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await login(username, password)
    const token = createToken(user)

    res.cookie('auth', token, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
    res.json({ user: { id: user.id, username: user.username } })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

const logoutController = (req, res) => {
  res.clearCookie('auth', cookieOptions)
  res.json({ message: 'Kirjauduttu ulos' })
}

export {logoutController, loginController, registerController}