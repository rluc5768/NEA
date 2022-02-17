import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home, NotFound, Private, Login, PrivateOutlet } from "./Pages/PageImports.js";

import { Navbar } from "./Components/ComponentImports.js";
function App() {
  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes> {/* Private outlet is used so that either the component is rendered if the user is authenticated, or it will redirect to /login*/}
          <Route path="/home" element={<Home />} />
          <Route path="/private" element={<PrivateOutlet />}>
            <Route path="" element={<Private />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
