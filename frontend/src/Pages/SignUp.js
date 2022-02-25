import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../Hooks/useToken.js";
import "./SignUp.css";
import ValidateInputs from "../ExternalClasses/InputValidationClass";
import { useRef } from "react";
export default function SignUp({ setToken }) {
  const [firstNameValid, setfirstNameValid] = useState(false);
  const [surnameValid, setSurnameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [invalidData, setInvalidData] = useState("");
  let VI = useRef(new ValidateInputs());

  const HandleSubmit = async function () {
    let errors = VI.current.allInputs("signUp");
    console.log(errors);
    console.log(VI);
    if (errors.length == 0) {
      try {
        //POST
        await fetch("http://localhost:8000/api/v1/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: VI.current.firstName,
            surname: VI.current.surname,
            email: VI.current.email,
            username: VI.current.username,
            password: VI.current.password,
          }),
        })
          .then((data) => data.json())
          .then((response) => console.log(response));
      } catch (e) {
        console.log("error" + e);
        setInvalidData("Error occured.");
      }
    } else {
      ChangeInputState(errors);
      setInvalidData("Invalid data entered.");
    }
  };
  const ChangeInputState = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      switch (errors[i]) {
        case "firstNameInvalid":
          setfirstNameValid(false);
          break;
        case "surnameInvalid":
          setSurnameValid(false);
          break;
        case "emailInvalid":
          setEmailValid(false);
          break;
        case "UsernameInvalid":
          setUsernameValid(false);
          break;
        case "passwordInvalid":
          setPasswordValid(false);
          break;
      }
    }
  };

  return (
    <>
      <h1>{invalidData}</h1>
      <div className="container">
        <form id="signUpForm" onSubmit={HandleSubmit} action="#">
          <div className="row">
            <label htmlFor="firstNameInput" className="form-label col-sm-2">
              First Name
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                className={`form-control ${
                  firstNameValid ? "validInput" : "invalidInput"
                }`}
                placeholder="e.g. Robert"
                id="firstNameInput"
                onChange={(e) => {
                  VI.current.firstName = e.target.value;
                  setfirstNameValid(VI.current.validateFirstName());
                }}
              />
            </div>
            <label htmlFor="surnameInput" className="form-label col-sm-2">
              Surname
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                className={`form-control ${
                  surnameValid ? "validInput" : "invalidInput"
                }`}
                placeholder="e.g. Lucas"
                id="surnameInput"
                onChange={(e) => {
                  console.log(e.target.value);
                  VI.current.surname = e.target.value;
                  setSurnameValid(VI.current.validateSurname());
                }}
              />
            </div>
          </div>

          <div className="row">
            <label htmlFor="emailInput" className="form-label col-sm-2">
              Email
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={`form-control ${
                  emailValid ? "validInput" : "invalidInput"
                }`}
                placeholder="email@example.com"
                id="emailInput"
                onChange={(e) => {
                  VI.current.email = e.target.value;
                  setEmailValid(VI.current.validateEmail());
                }}
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="usernameInput" className="form-label col-sm-2">
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={`form-control ${
                  usernameValid ? "validInput" : "invalidInput"
                }`}
                placeholder="Username"
                id="usernameInput"
                onChange={(e) => {
                  VI.current.username = e.target.value;
                  setUsernameValid(VI.current.validateUsername());
                }}
              />
            </div>
          </div>
          <div className="row">
            <label htmlFor="passwordInput" className="form-label col-sm-2">
              Password
            </label>
            <div className="col">
              <input
                type="password"
                className={`form-control ${
                  passwordValid ? "validInput" : "invalidInput"
                }`}
                placeholder="Password"
                id="passwordInput"
                onChange={(e) => {
                  VI.current.password = e.target.value;
                  setPasswordValid(VI.current.validatePassword());
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3" />
            <input
              type="submit"
              value="Submit"
              className="btn btn-outline-success col-sm-6 center"
            />
          </div>
        </form>
        <br />
        <p className="text-center">
          Already have an account? sign in <Link to="/login">here.</Link>
        </p>
      </div>
    </>
  );
}
