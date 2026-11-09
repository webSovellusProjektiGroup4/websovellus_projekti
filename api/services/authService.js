import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { findUserByUsername, createUser } from '../models/User.js'

const register = async (username, password) =>{
    const existing = await findUserByUsername(username)
    if (existing){
        const error = new Error("Käyttäjätunnus on jo käytössä")
        error.status = 409
        throw error
    }
    const hash = await argon2.hash(password);
    const user = await createUser(username, hash)
    return user
}

const login = async (username, password) => {
    const user = await findUserByUsername(username)
    if (!user){
        const error = new Error("Väärä käyttäjätunnus tai salasana")
        error.status = 401
        throw error
    }
    const ok = await argon2.verify(user.password_hash, password)
    if (!ok){
        const error = new Error("Väärä käyttäjätunnus tai salasana")
        error.status = 401
        throw error
    }
    return user

}

const createToken =  (user) => {
    return jwt.sign({sub: user.id}, process.env.JWT_TOKEN, { expiresIn: '30m', algorithm: 'HS256', issuer: 'movie-app', audience: 'movie-app-web'} )
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN, { algorithms: ['HS256'], issuer: 'movie-app', audience: 'movie-app-web' })
}

const cookieName = 'auth'
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}

export { register, login, createToken, verifyToken, cookieName, cookieOptions }