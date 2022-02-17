import {useState} from 'react';
async function loginUser(userDetails){
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

    const HandleSubmit = async (event) => {
        event.preventDefault();//Prevents the default form action for Ajax form submissions.
        const token = await loginUser({
            username,
            password,
        });
        console.log("token: "+JSON.stringify(token));

    }
    return (
        <>
            <h1>Please login</h1>
            <form onSubmit={HandleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text"  onChange={(e) => setUsername(e.target.value)}/>
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