import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import useToken from "../Hooks/useToken.js";
export default function SignUp({ setToken }) {
  const [firstName, setFirstName] = useState();
  const [surname, setSurname] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const HandleSubmit = async () => {
    fetch("http://localhost:8000/api/v1/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        surname: surname,
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        if ("token" in response) {
          console.log("SUCCESS"); //Save token in session storage and then navigate to the homepage.abs
          setToken(response["token"]);
          navigate("/home");
        }
      });
  };
  return (
    <>
      <div className="container">
        <form id="signUpForm" onSubmit={HandleSubmit} action="#">
          <div className="row">
            <label htmlFor="firstNameInput" className="form-label col-sm-2">
              First Name
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Robert"
                id="firstNameInput"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <label htmlFor="surnameInput" className="form-label col-sm-2">
              Surname
            </label>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lucas"
                id="surnameInput"
                onChange={(e) => {
                  setSurname(e.target.value);
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
                className="form-control"
                placeholder="email@example.com"
                id="emailInput"
                onChange={(e) => {
                  setEmail(e.target.value);
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
                className="form-control"
                placeholder="Username"
                id="usernameInput"
                onChange={(e) => {
                  setUsername(e.target.value);
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
                className="form-control"
                placeholder="Password"
                id="passwordInput"
                onChange={(e) => {
                  setPassword(e.target.value);
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
