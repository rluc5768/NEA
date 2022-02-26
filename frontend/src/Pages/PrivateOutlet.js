import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
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

function PrivateOutlet() {
  const [pageState, setPageState] = useState("loading");

  if (pageState === "loading") {
    Authentication.User(getToken(), setPageState);
  }

  //const auth = Authentication.User(getToken(), setPageState);
  //console.log(auth);
  //If the authentication fails, token should be removed, otherwise remains the same.
  if (pageState === "loading") {
    return <div>loading</div>;
  }
  console.log(pageState);
  return pageState === "valid" ? (
    <Outlet />
  ) : (
    <Login setPageState={setPageState} />
  );
}
export default PrivateOutlet;
