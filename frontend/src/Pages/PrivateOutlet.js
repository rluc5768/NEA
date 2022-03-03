import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useToken from "../Hooks/useToken.js";
import Authentication from "../Services/Authentication";
import React from "react";
import { Login } from "./PageImports.js";
function getToken() {
  //gets the value of token from session storage.
  try {
    return JSON.parse(sessionStorage.getItem("token"));
  } catch (e) {
    sessionStorage.removeItem("token");
  }
}

function PrivateOutlet(props) {
  //const [userLoggedIn, setUserLoggedIn] = useState(false);
  console.log("RENDERED")
  
  useEffect(()=>{//executes after render.
    Authentication.User(getToken(), props.LogUserInOrOut, props.changeUsername)
  });
  
  
  return props.userLoggedIn? (
    <Outlet context={[props.userLoggedIn,props.LogUserInOrOut]}/>
  ) : (
    <Login setUserLoggedIn={props.LogUserInOrOut} />
  );
}
export default PrivateOutlet;
