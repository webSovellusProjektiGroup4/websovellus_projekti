
import { useState } from 'react'
import './LoginAndRegisterPage.css'
import { useAuth } from '../providers/AuthProvider.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'



function RegisterPage() {
  const navigate = useNavigate();
    const { register, login } = useAuth();
    const location = useLocation()
    const from = location.state?.from ?? '/'
  const [error, setError] = useState('');
  async function submit(e) {
            e.preventDefault();
    if(e.target.password.value===e.target.secondpassword.value){


        setError('');
        try {
            await register(e.target.username.value, e.target.password.value);
            await login(e.target.username.value, e.target.password.value)

            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.error || 'Rekisteröityminen epäonnistui')
        }
    } else {
        setError("Annetut salasanat eivät täsmää")

    }
  }

  return (
    <div className='login-page'>
    <h1>Rekisteröidy</h1>
    <form onSubmit={submit}>

    <label>Käyttäjänimi

    <input name="username"  required ></input>
    </label>
    <label>Salasana

    <input type="password" name="password" required></input>
        </label>

    <label>Toista salasana

    <input type="password" name="secondpassword" required></input>
    </label>
    <button type="button" onClick={()=>navigate('/', { replace: true })}>
          Takaisin etusivulle
    </button>
    <button>
          Rekisteröidy
    </button>
    <br/>
        <Link to="/login">Onko sinulla jo tili? Kirjaudu</Link>


    </form>
     {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default RegisterPage
