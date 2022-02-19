import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useToken from "../Hooks/useToken.js";
import Authentication from "../Services/Authentication";
import React from "react";
function PrivateOutlet({ token }) {
  const [State, setState] = useState("loading");

  useEffect(() => {
    (async function () {
      try {
        const auth = await Authentication.User(token);
        console.log(auth);
        setState(auth ? "valid" : "invalid");
      } catch {
        setState("invalid");
      }
    })();
  }, []);

  if (State === "loading") {
    return <div>loading</div>;
  }
  return State === "valid" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace="true" />
  );
}
export default PrivateOutlet;
