import "bootswatch/dist/journal/bootstrap.min.css";

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

import ErrorPage from "./ErrorPage";
import Login from "./auth/login";
import Register from "./auth/register";
import Chat from "./Chat";
import Home from "./Home";
import NavBarShareLayout from "./NavBarShareLayout";
import CoursesPageShareLayout from "./CoursesPageShareLayout";
import AllCourses from "../components/courses/AllCourses";
import RegisteredCourses from "../components/courses/RegisteredCourses";
import PlannedCourses from "../components/courses/PlannedCourses";
import LearnedProfile from "../components/courses/LearnedProfile";
import CourseDetails from "./CourseDetails";
import { axiosInstance, apiUrl } from "../support/axios_setting";

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

    const checkAndRefreshToken = () => {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    checkAndRefreshToken();

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `${apiUrl}/api/GetUserInformation`
        );
        localStorage.setItem("username", response.data.username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route element={<NavBarShareLayout auth={auth} setAuth={setAuth} />}>
          <Route path="/" element={<Home auth={auth} />} />
          <Route element={<CoursesPageShareLayout auth={auth} />}>
            <Route path="courses/" element={<AllCourses />} />
            <Route path="courses/:courseId" element={<CourseDetails />} />
            <Route
              path="courses/showRegisteredCourses"
              element={<RegisteredCourses />}
            />
            <Route
              path="courses/showPlannedCourses"
              element={<PlannedCourses />}
            />
            <Route
              path="courses/showLearnedProfile"
              element={<LearnedProfile />}
            />
          </Route>
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
