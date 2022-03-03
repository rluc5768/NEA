import { useState } from "react";
import Login from "../Pages/Login";
const Authentication = {
  //User : function (){//This is where the token will be validated
  //const [token, setToken] = useToken();
  //let token= "dsfdsfsdf";
  //=============== Initial Validation ===================

  //=============== End of intial validation =============

  //return true; //true if valid, false if invalid.
  User: function (currentToken, setUserLoggedIn, changeUsername) {
    console.log("c_token: " + currentToken);
    if (currentToken == null) {
      setUserLoggedIn(false);
      return;
    }
    //console.log("Bearer ".concat(currentToken))
    validateJWT("Bearer ".concat(currentToken))
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        if( res["type"] == "authorised"){//Can trust JWT
          
          setUserLoggedIn(true);
          changeUsername(res["username"]);
        }
        else{
          setUserLoggedIn(false);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    
  },
};

export default Authentication;

async function validateJWT(token) {
  return fetch("http://localhost:8000/api/v1/authorise_user/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  });
}
