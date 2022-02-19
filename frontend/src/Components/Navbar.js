import { Link } from "react-router-dom";

function Navbar() {
  return (
    <ul>
      <li>
        <Link to="/private/home">home</Link>
      </li>
      <li>
        <Link to="/private">private</Link>
      </li>
      <li>
        <Link to="/sign_up">Sign up</Link>
      </li>
    </ul>
  );
}
export default Navbar;
