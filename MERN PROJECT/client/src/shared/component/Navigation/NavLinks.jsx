import React, { useContext }  from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return <ul className="nav-links">
    <li>
        <NavLink to="/" exact>ALL USERS</NavLink>
    </li>
    {auth.isLogin && <li>
        <NavLink to={`${auth.userId}/places`}>MY PLACES</NavLink>
    </li>}
    {auth.isLogin && <li>
        <NavLink to="/places/new">NEW PLACE</NavLink>
    </li>}
    {!auth.isLogin && <li>
        <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>}
    {auth.isLogin && <li><button onClick={auth.logout}>LOGOUT</button></li>}
  </ul>;
};

export default NavLinks;
