import { useState } from "react";
const Authentication = {
  //User : function (){//This is where the token will be validated
  //const [token, setToken] = useToken();
  //let token= "dsfdsfsdf";
  //=============== Initial Validation ===================

  //=============== End of intial validation =============

  //return true; //true if valid, false if invalid.
  User: function (token) {
    return validateJWT(token);
  },
};
export default Authentication;

async function validateJWT(token) {
  const response = await fetch("http://localhost:8000/api/v1/authorise_user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(token),
  });
  const json = await response.json();
  return json;
}
