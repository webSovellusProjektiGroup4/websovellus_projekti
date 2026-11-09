import app from './app.js'


if (!process.env.JWT_TOKEN || process.env.JWT_TOKEN.length < 32) {
  throw new Error('JWT_SECRET puuttuu tai on liian lyhyt')
}
const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`)
})

