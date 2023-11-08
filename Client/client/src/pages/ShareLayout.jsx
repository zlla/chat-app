import { Outlet, NavLink } from "react-router-dom";

const ShareLayout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to={`/home`}>Home</NavLink>
          </li>
          <li>
            <NavLink to={`/chat`}>Chat</NavLink>
          </li>
          <li>
            <NavLink to={`/auth/login`}>Login</NavLink>
          </li>
          <li>
            <NavLink to={`/auth/register`}>Register</NavLink>
          </li>
        </ul>
      </nav>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};
export default ShareLayout;
