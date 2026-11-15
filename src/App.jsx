
import './App.css'
import { Routes, Route } from 'react-router-dom'

import Homepage from './pages/Homepage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CreateGroupPage from './pages/CreateGroupPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'
import JoinToGroupPage from './pages/JoinToGroupPage.jsx'

import MovieListsPage from './pages/MovieListsPage.jsx'
import SharedMovieListPage from './pages/SharedMovieListPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/groups/new" element={<CreateGroupPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/groups/:id" element={<GroupDetailPage />} />
      <Route path="/join/:token" element={<JoinToGroupPage />} />

      <Route path="/lists" element={<MovieListsPage />} />
      <Route path="/shared/lists/:listId" element={<SharedMovieListPage />} />
    </Routes>
  )
}

export default App
