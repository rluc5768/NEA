import { Link } from "react-router-dom";
import "./Navbar.css";
function Navbar(props) {//props.userLoggedIn, props.username
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <Link className="navbar-brand" to="/home">
        Workout Planner
      </Link>
      <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/workout_planner">
                Planner
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tracking">
                Tracking
              </Link>
            </li>
            {props.userLoggedIn &&
            <div className="navbar-right">
              <li className="nav-item">
                <Link className="nav-link" to="/account">
                  {props.username}
                </Link>
              </li>
            </div>
}
          {!props.userLoggedIn && 
            <li className="nav-item">
            <Link className="nav-link" to="/sign_up">
              SignUp
            </Link>
          </li>
          }

          </ul>
        </div>
    </nav>
    
  );
}
export default Navbar;
