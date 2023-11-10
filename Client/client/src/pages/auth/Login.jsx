import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = (props) => {
  const { setAuth } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5255/api/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setAuth(true);
      navigate("/chat");
    } catch (error) {
      console.log(error);
    }
  };

  // test
  const getData = () => {
    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:5255";

    const axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    axiosInstance
      .get(`${apiUrl}/WeatherForecast`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // end test

  return (
    <>
      <form>
        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <br />

        <label htmlFor="psw">
          <b>Password</b>
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <br />

        <button type="button" onClick={(e) => handleSubmit(e)}>
          submit
        </button>
      </form>
      <br />
      <br />
      <button
        type="button"
        onClick={() => {
          getData();
        }}
      >
        Get Data
      </button>
    </>
  );
};

Login.propTypes = {
  setAuth: PropTypes.func,
};

export default Login;
