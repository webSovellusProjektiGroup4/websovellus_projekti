
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

import Homepage from './pages/Homepage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CreateGroupPage from './pages/CreateGroupPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'
import JoinToGroupPage from './pages/JoinToGroupPage.jsx'
import MovieDetailPage from './pages/MovieDetailPage.jsx'

import MovieListsPage from './pages/MovieListsPage.jsx'
import SharedMovieListPage from './pages/SharedMovieListPage.jsx'


function App() {
  const location = useLocation()
  // Kun elokuva avataan kortista, sivu jonka päältä se avattiin (background) jää näkyviin taustalle
  const background = location.state?.background

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes location={background || location}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/groups/new" element={<CreateGroupPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:id" element={<GroupDetailPage />} />
          <Route path="/join/:token" element={<JoinToGroupPage />} />

          <Route path="/lists" element={<MovieListsPage />} />
          <Route path="/shared/lists/:listId" element={<SharedMovieListPage />} />

          {/* Suoraan avattu elokuvalinkki (ei taustasivua) */}
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Routes>
      </div>

      {/* Kortista avattu elokuva: kerros taustasivun päälle */}
      {background && (
        <Routes>
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Routes>
      )}
    </>
  )
}

export default App
