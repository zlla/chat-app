import PropTypes from "prop-types";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

const NavBarShareLayout = (props) => {
  const { auth, setAuth } = props;
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    setAuth(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-black" to={"/"}>
            Siu
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to={`/`}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={`/chat`}>
                  Chat
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/courses"}>
                  Courses
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/"}>
                  Jobs
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  More
                </a>
                <div className="dropdown-menu">
                  <NavLink className="dropdown-item" to={"/"}>
                    About Us
                  </NavLink>
                  {!auth ? (
                    <>
                      <NavLink className="dropdown-item" to={`/auth/login`}>
                        Login
                      </NavLink>
                      <NavLink className="dropdown-item" to={`/auth/register`}>
                        Register
                      </NavLink>
                    </>
                  ) : (
                    <button
                      className="dropdown-item"
                      onClick={() => handleLogOut()}
                    >
                      Logout
                    </button>
                  )}
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item"
                    href="https://www.facebook.com/nguyenhoangan32/"
                    target="_tab"
                  >
                    fb: Nguyen Hoang An
                  </a>
                </div>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

NavBarShareLayout.propTypes = {
  auth: PropTypes.bool,
  setAuth: PropTypes.func,
};

export default NavBarShareLayout;
