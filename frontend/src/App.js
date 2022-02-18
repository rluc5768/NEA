import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, NotFound, Private, Login, PrivateOutlet } from "./Pages/PageImports.js";
import useToken from "./Hooks/useToken.js";
import { Navbar } from "./Components/ComponentImports.js";
function App() {
  const {token, setToken} = useToken();
  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes> {/* Private outlet is used so that either the component is rendered if the user is authenticated, or it will redirect to /login*/}
          
          <Route path="/private" element={<PrivateOutlet token={token}/>}>
            <Route path="" element={<Private />} />
            <Route path="home" element={<Home />} />
          </Route>

          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
