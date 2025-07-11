import React from 'react'
import Navbar from './pages/Navbar'
import Login from './pages/login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import CartPage from './pages/Cart'
import ProductPage from './pages/Productpage'


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />

}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}



const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <>

              <Home />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterAndLogout />
          }
        />
        <Route
          path="/product"
          element={<ProductPage />}
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
