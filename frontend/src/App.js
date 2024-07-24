import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/Routes/Private";
import AboutPage from "./pages/AboutPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import PolicyPage from "./pages/PolicyPage";
import Dashboard from "./pages/user/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<Dashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
