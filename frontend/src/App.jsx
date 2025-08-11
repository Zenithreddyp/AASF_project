import React from "react";
import Navbar from "./pages/Navbar";
import Login from "./pages/login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import ProductPage from "./pages/Productpage";
import PaymentPage from "./pages/Paymentpage";
import CartPage from "./pages/Cartpage";
import SearchPage from "./pages/Searchpage";
import UPIPage from "./pages/UPIpage";
import Orders from "./pages/Orderspage";
import Footer from "./pages/Footer";
import Adminpanel from "./pages/Adminpanel";
import Wishlist from "./pages/Wishlist";

import Profilepage from "./pages/Profilepage.jsx";
// import Loadingpage from "./pages/Loadingpage";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

const App = () => {
  return (
    <BrowserRouter>
      {/* <Loadingpage /> */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/profilepage"
          element={
            <ProtectedRoute>
              <Profilepage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/upi" element={<UPIPage />} />

        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/adminpage" element={<Adminpanel />} />

        <Route path="/logout" element={<Logout />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
