import { cookieName } from "../services/authService.js";
import jwt from 'jsonwebtoken'
import {findUserById} from  "../models/User.js";


const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies[cookieName];

    if (!token)    
      return res.status(401).json({ error: 'Kirjautuminen vaaditaan' });

    const payload = jwt.verify(token, process.env.JWT_TOKEN, {
      algorithms: ['HS256'], issuer: 'movie-app', audience: 'movie-app-web'
    });

    const user = await findUserById(payload.sub)
    if (!user) 
      return res.status(401).json({ error: 'Käyttäjää ei löydy' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Istunto ei ole voimassa' });
  }
}
export default requireAuth