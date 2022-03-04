import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";
import {
  Home,
  NotFound,
  Private,
  Login,
  PrivateOutlet,
  SignUp,
  Planner,
  Account,
  Tracking,
  ResetPassword,
  VerifyPasswordReset,
  DeleteAccount
} from "./Pages/PageImports.js";
import { useState } from "react";
import useToken from "./Hooks/useToken.js";
import { Navbar } from "./Components/ComponentImports.js";

function App() {
  //console.log("token: " + token);
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const LogUserInOrOut = function(value){
    setUserLoggedIn(value);
  }
  const changeUsername = function(value){
    setUsername(value);
  }

  return (
    <>
      <BrowserRouter>
        <Navbar userLoggedIn={userLoggedIn} username={username}/>
        <Routes>
          {/* Private outlet is used so that either the component is rendered if the user is authenticated, or it will redirect to /login*/}
          <Route exact path="/" element={<Navigate to="/home"/>}/>
          <Route path="/" element={ <PrivateOutlet userLoggedIn={userLoggedIn} LogUserInOrOut={LogUserInOrOut} changeUsername={changeUsername}/>}>
            <Route path="private" element={<Private />} />
            <Route path="home" element={<Home />} />
            <Route path="workout_planner" element={ <Planner/>}/>
            <Route path="tracking" element={<Tracking/>}/>
            <Route path="account" element={<Account username={username} LogUserInOrOut={LogUserInOrOut}/>}> {/*For a tab menu */}
              <Route path="deleteAccount" element={<DeleteAccount username={username} LogUserInOrOut={LogUserInOrOut} /> }/>
              <Route path="resetPassword" element={<ResetPassword username={username}/>}/>{/*Confirm that the user wants to change their password. */}
            </Route>
          </Route>
          <Route path="/resetPassword/:username" element={<VerifyPasswordReset LogUserInOrOut={LogUserInOrOut}/>}/>
          <Route path="/sign_up" element={<SignUp LogUserInOrOut={LogUserInOrOut} />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
