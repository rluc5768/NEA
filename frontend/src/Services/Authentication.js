import { useState } from "react";
const Authentication = {
  //User : function (){//This is where the token will be validated
  //const [token, setToken] = useToken();
  //let token= "dsfdsfsdf";
  //=============== Initial Validation ===================

  //=============== End of intial validation =============

  //return true; //true if valid, false if invalid.
  User: function (currentToken, setPageState) {
    console.log("c_token: " + currentToken);
    if (currentToken == null) {
      setPageState("invalid");
    }
    validateJWT(currentToken)
      .then((data) => data.json())
      .then((valid) => {
        console.log(valid);
        setPageState(valid ? "valid" : "invalid");
      });
    /*
    (async function () {
      let auth = (await validateJWT(currentToken)).bodyUsed;
      console.dir("asdsa" + auth);
      setPageState(auth ? "valid" : "invalid");
    })(); //auto-executing function*/
  },
};

export default Authentication;

async function validateJWT(token) {
  return fetch("http://localhost:8000/api/v1/authorise_user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(token),
  });
}
