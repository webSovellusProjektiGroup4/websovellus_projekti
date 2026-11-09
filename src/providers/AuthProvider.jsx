import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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