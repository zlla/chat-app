import "bootswatch/dist/journal/bootstrap.min.css";

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
  const initialToken = localStorage.getItem("accessToken");
  const [token, setToken] = useState(initialToken);
  const [auth, setAuth] = useState(!!initialToken);

  useEffect(() => {
    const apiUrl = "http://localhost:5255";

    const fetchNewToken = async () => {
      const aT = localStorage.getItem("accessToken");
      const rT = localStorage.getItem("refreshToken");

      try {
        const axiosInstance = axios.create({
          baseURL: apiUrl,
          headers: {
            Authorization: `Bearer ${aT}`,
            refreshToken: rT,
          },
        });

        const response = await axiosInstance.post(
          `${apiUrl}/api/auth/refresh-token`
        );

        let newAT = response.data.accessToken;
        localStorage.setItem("accessToken", newAT);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setToken(newAT);
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchNewToken, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    async function requireAuth(token) {
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
      requireAuth(token);
    }
  }, [token, setAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<ShareLayout auth={auth} setAuth={setAuth} />}>
          <Route path="/" element={<Home />} />
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
