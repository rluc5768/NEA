import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Map, ActivityList, LoadAndSort } from "../Components/ComponentImports";
import "./Home.css";
function getToken() {
  //gets the value of token from session storage.
  try {
    return JSON.parse(sessionStorage.getItem("token"));
  } catch (e) {
    sessionStorage.removeItem("token");
  }
}

function Home() {
  const search = useLocation().search;
  console.log(search);
  console.log(new URLSearchParams(search).get("code"));

  let scope = new URLSearchParams(search).get("scope");
  if (scope == "read,activity:read_all") {
    let code = new URLSearchParams(search).get("code");
    console.log(code);
    fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: 53221,
        client_secret: "1a3a01f913e69e0868315901ebb13c27aae61dd4", //would be hidden.
        code: code,
        grant_type: "authorization_code",
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        try {
          //Save tokens in database and set stravaAuthorised to true. THen can make requests.
        } catch (e) {}
      });
  }
  const HandleClick = function () {
    //First check if the user is strava_authorised. by calling get on "/user"
    //IF NOT strava authorised, redirected to strava login, url checked and user details modified.
    fetch("http://localhost:8000/api/v1/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res["type"] == "user_details") {
          //successful
          let userDetails = res["details"];
          if (!userDetails["stravaAuthorised"]) {
            //redirect to strava oauth page.
            window.location =
              "https://www.strava.com/oauth/authorize?client_id=53221&redirect_uri=http://localhost:3000/home&response_type=code&scope=activity:read_all";
          }
        } else {
          //unsuccessful - handle errors
        }
      });
  };
  return (
    <div className="container-fluid" id="grid-container">
      <div className="row show-grid h-75">
        <div className="col col-md-7">
          <Map />
        </div>
        <div className="col col-md-5">
          <ActivityList />
        </div>
      </div>
      <div className="row">
        <div className="col-7"></div>
        <div className="col col-md-5">
          <button className="btn btn-primary" onClick={HandleClick}>
            Load
          </button>
        </div>
      </div>
    </div>
  );
}
export default Home;
