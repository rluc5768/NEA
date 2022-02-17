import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {Home, NotFound, Private, Login} from "./Pages/PageImports.js";

import {Navbar} from "./Components/ComponentImports.js";
function App() {
  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/private" element={<Private/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={ <NotFound/> }/>
      </Routes>
    
    </BrowserRouter>
    </>
  );
}

export default App;
