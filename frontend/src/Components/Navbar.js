import { Link } from "react-router-dom";

function Navbar(){
    return(
        <ul>

            <li><Link to="/home">home</Link></li>
            <li><Link to="/private">private</Link></li>
        </ul>
    );
}
export default Navbar;