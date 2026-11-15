import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';

const AuthContext = createContext(null);
const AUTH_ROUTES = ['/api/auth/me', '/api/auth/login', '/api/auth/register']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    //TÄmä osio navigoi uudestaan login pagelle jos token vanhentuu ja ei olla jo jossain auth pathissa
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status
        const url = error.config?.url ?? ''

        if (status === 401 && !AUTH_ROUTES.some((route) => url.startsWith(route))) {
          setUser(null)
          navigate('/login', { state: { from: location.pathname } })
        }
        return Promise.reject(error)     
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [navigate, location.pathname])

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await axios.post('/api/auth/login', { username, password })
    setUser(res.data.user);
  }

  async function register(username, password) {
    await axios.post('/api/auth/register', { username, password })
    
  }


  async function logout() {
    await axios.post('/api/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register  }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { 
  return useContext(AuthContext); 
}