import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Homepage from './pages/Homepage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'


function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </>
  )
}

export default App
