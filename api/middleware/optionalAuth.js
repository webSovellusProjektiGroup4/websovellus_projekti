// Tämä optionalAuth tehdään sitä varten, että kun palautetaan reviewit niin halutaan mys öpalauttaa käyttäjän antamat reviewit, jos hän on kirjautunut.
import { cookieName } from "../services/authService.js";
import jwt from 'jsonwebtoken'
import {findUserById} from  "../models/User.js";


const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies[cookieName];

    if (!token)   {

     return   next();
    } 
    const payload = jwt.verify(token, process.env.JWT_TOKEN, {
      algorithms: ['HS256'], issuer: 'movie-app', audience: 'movie-app-web'
    });

    const user = await findUserById(payload.sub)
    if (!user) {

       return next();
    }
    req.user = user;
    next();
  } catch {
    return next();
  }
}
export default optionalAuth