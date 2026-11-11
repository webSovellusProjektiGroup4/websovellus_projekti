import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Homepage from './pages/Homepage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import CreateGroupPage from './pages/CreateGroupPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import GroupDetailPage from './pages/GroupDetailPage.jsx'


function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/groups/new" element={<CreateGroupPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/groups/:id" element={<GroupDetailPage />} />
    </Routes>
    </>
  )
}

export default App
