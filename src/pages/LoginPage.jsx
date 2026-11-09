
import { useState } from 'react'
import './LoginAndRegisterPage.css'
import { useAuth } from '../providers/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'



function LoginPage() {
  const navigate = useNavigate();
    const { login } = useAuth();

  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(e.target.username.value, e.target.password.value);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Kirjautuminen epäonnistui')
    }
  }

  return (
    <div className='login-page'>
    <h1>Kirjaudu</h1>
    <form onSubmit={submit}>

    <label>Käyttäjänimi

    <input name="username"  required ></input>
    </label>
    <label>Salasana

    <input type="password" name="password" required></input>
    </label>

    <button type="button" onClick={()=>navigate('/', { replace: true })}>
          Takaisin etusivulle
    </button>
        <button>
          Kirjaudu
    </button>
    <br/>
    <Link to="/register">Eikö sinulla ole tiliä? Rekisteröidy</Link>
    </form>
     {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default LoginPage
