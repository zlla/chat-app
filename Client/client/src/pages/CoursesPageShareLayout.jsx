import { NavLink, Outlet, useLocation } from "react-router-dom";
import "../styles/coursespage/CoursesPageShareLayout.css";

const CoursesPageShareLayout = () => {
  const location = useLocation();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Navbar */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="position-sticky">
            <div className="d-flex flex-column">
              <div className="p-3 d-flex">
                <img
                  src="https://placekitten.com/50/50"
                  alt="Profile"
                  className="rounded-circle"
                />
                <p className="ms-3 my-auto">
                  {localStorage.getItem("username")}
                </p>
              </div>

              <NavLink
                to={"courses/"}
                className={`nav-link custom-link ${
                  location.pathname === "/courses" ||
                  location.pathname === "/courses/"
                    ? "active-link"
                    : ""
                }`}
              >
                All Courses
              </NavLink>
              <NavLink
                to={"courses/showRegisteredCourses"}
                className={`nav-link custom-link ${
                  location.pathname === "/courses/showRegisteredCourses"
                    ? "active-link"
                    : ""
                }`}
              >
                Registered Courses
              </NavLink>
              <NavLink
                to={"courses/showPlannedCourses"}
                className={`nav-link custom-link ${
                  location.pathname === "/courses/showPlannedCourses"
                    ? "active-link"
                    : ""
                }`}
              >
                Planned Courses
              </NavLink>
              <NavLink
                to={"courses/showLearnedProfile"}
                className={`nav-link custom-link ${
                  location.pathname === "/courses/showLearnedProfile"
                    ? "active-link"
                    : ""
                }`}
              >
                Profile
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="col-md-10 px-md-4">
          <div className="w-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesPageShareLayout;
