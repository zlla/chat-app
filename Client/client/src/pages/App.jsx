import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import ErrorPage from "./error-page";
import Login from "./auth/login";
import Register from "./auth/register";
import Chat from "./Chat";
import Home from "./Home";
import ShareLayout from "./ShareLayout";

function App() {
  const token = localStorage.getItem("token");
  const [auth, setAuth] = useState(!!token);

  useEffect(() => {
    async function requireAuth() {
      try {
        await axios.post("http://localhost:5255/api/auth/validate-token", {
          AccessToken: token,
        });
        setAuth(true);
      } catch (error) {
        setAuth(false);
      }
    }

    if (token) {
      requireAuth();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<ShareLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/login" element={<Login setAuth={setAuth} />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/chat"
            element={auth ? <Chat /> : <Navigate to="/auth/login" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
