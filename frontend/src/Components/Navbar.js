import { Link } from "react-router-dom";

function Navbar() {
  return (
    <ul>
      <li>
        <Link to="/home">home</Link>
      </li>
      <li>
        <Link to="/private">private</Link>
      </li>
      <li>
        <Link to="/workout_planner">Planner</Link>
      </li>
      <li>
        <Link to="/sign_up">Sign up</Link>
      </li>
    </ul>
  );
}
export default Navbar;
