import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useToken from "../Hooks/useToken.js";
import Authentication from "../Services/Authentication";
import React from "react";
import { Login } from "./PageImports.js";
function getToken() {
  //gets the value of token from session storage.
  return JSON.parse(sessionStorage.getItem("token"));
}

function PrivateOutlet() {
  const [pageState, setPageState] = useState("loading");
 // const [token, setToken] = useState(getToken());
  
  /*const saveToken = (userToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken);
  }*/
  
  const auth = Authentication.User(getToken());
  console.log(auth);
  

  /*useEffect(() => {
    //useeffect called after every re-render.
    (async function () {
      try {
        const auth = await Authentication.User(token);
        setState(auth ? "valid" : "invalid");
      } catch {
        setState("invalid");
      }
    })();
  }, []);*/

  if (pageState === "loading") {
    return <div>loading</div>;
  }
  return pageState === "valid" ? <Outlet /> : <Login />;
}
export default PrivateOutlet;
