import React from 'react'
import Navbar from './pages/Navbar'
import Login from './pages/login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import CartPage from './pages/Cart'
import Error404Page from './pages/Error404Page'
import Header from './pages/Header'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />


      </Routes>
    </BrowserRouter>
  )
}
// function Logout() {
//   localStorage.clear()
//   return <Navigate to="/login" />

// }

// function RegisterAndLogout() {
//   localStorage.clear()
//   return <Register />
// }

export default App
