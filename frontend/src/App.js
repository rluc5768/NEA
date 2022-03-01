import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Home,
  NotFound,
  Private,
  Login,
  PrivateOutlet,
  SignUp,
  Planner
} from "./Pages/PageImports.js";
import useToken from "./Hooks/useToken.js";
import { Navbar } from "./Components/ComponentImports.js";
function App() {
  //console.log("token: " + token);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Private outlet is used so that either the component is rendered if the user is authenticated, or it will redirect to /login*/}
          <Route path="/" element={<PrivateOutlet />}>
            <Route path="private" element={<Private />} />
            <Route path="home" element={<Home />} />
            <Route path="workout_planner" element={ <Planner/>}/>
          </Route>
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
