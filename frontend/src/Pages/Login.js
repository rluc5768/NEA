import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

async function loginUser(userDetails) {
  return fetch("http://localhost:8000/api/v1/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  }).then((data) => data.json());
}
function Login({ setUserLoggedIn }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  //const navigate = useNavigate();

  const HandleSubmit = async (event) => {
    event.preventDefault(); //Prevents the default form action for Ajax form submissions.
    const response = await loginUser({
      username,
      password,
    });
    console.log(response);
    console.log(response["type"] + " " + response["token"]);
    if (response["type"] == "auth_token") {
      //SaveToken here //removed the navigate as when authorise_user api is called the state of the token should change re-rendering the page.
      sessionStorage.setItem("token", JSON.stringify(response["token"]));
      setUserLoggedIn(true);
    }
    //====================== Do something with errors HERE ==========================
  };
  return (
    <>
      <h1 className="text-center">Please login</h1>
      <div className="container">
        <form onSubmit={HandleSubmit} className="text-center">
          <div className="row">
            <label className="form-label ">
              <p>Username</p>
            </label>
            <div className="col-4">
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
              />
            </div>
            <label>
              <p>Password</p>
            </label>
            <div className="col-4">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                type="submit"
                value="Submit"
                className="btn btn-outline-success col-sm-6 center"
              />
            </div>
          </div>
        </form>
      </div>
      <p className="text-center">
        <Link to="/sign_up">Or sign up here.</Link>
      </p>
    </>
  );
}
export default Login;
