// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import FormTamu from "./pages/FormTamu";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GuestDetail from "./components/GuestDetail";
import EditGuestForm from "./pages/EditGuestForm"; 
import FollowUpForm from "./pages/FollowUpForm"; 
import { GuestContext } from "./context/GuestContext";
import FormBukuTamu from './components/FormBukuTamu';
import UserManagement from "./pages/Usermanagement";
import PrintPDF from "./pages/PrintPDF";
import "./Styles.css";

function App() {
  const [guests, setGuests] = useState([]);

  return (
    <GuestContext.Provider value={{ guests, setGuests }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tamu" element={<FormTamu />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/detail/:id" element={<GuestDetail />} />
          <Route
            path="/pages/EditGuestForm/:id"
            element={<EditGuestForm />}
          />{" "}
          {/* ✅ */}
          <Route
            path="/pages/FollowUpForm/:id"
            element={<FollowUpForm />}
          />{" "}
          {/* ✅ */}
          <Route path="/form-buku-tamu" element={<FormBukuTamu />} />
          <Route path="/pages/Usermanagement" element={<UserManagement />} />
          <Route path="/pages/PrintPDF" element={<PrintPDF />} />
        </Routes>
      </Router>
    </GuestContext.Provider>
  );
}

export default App;
