import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
async function loginUser(userDetails) {
  return fetch("http://localhost:8000/api/v1/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  }).then((data) => data.json());
}
function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const HandleSubmit = async (event) => {
    event.preventDefault(); //Prevents the default form action for Ajax form submissions.
    const response = await loginUser({
      username,
      password,
    });
    console.log("token" in response);
    if ("token" in response) {
      //setToken(response["token"]); //removed the navigate as when authorise_user api is called the state of the token should change re-rendering the page.
    }
    //====================== Do something with errors HERE ==========================
  };
  return (
    <>
      <h1>Please login</h1>
      <form onSubmit={HandleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
}
export default Login;
