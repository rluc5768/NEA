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

function Home() {//if there is a validation_error then log the user out.
  
  const search = useLocation().search;
  console.log(search);
  console.log(new URLSearchParams(search).get("code"));
  
  let scope = new URLSearchParams(search).get("scope");
  if (scope == "read,activity:read_all") {//Will check the previous url to stop 'bad requests' or clear search params.
    let code = new URLSearchParams(search).get("code");
    var uri = window.location.toString();//from https://onlinecode.org/jquery-remove-query-string-parameter-from-url-expertphp/
    var clean_uri = uri.substring(0, uri.indexOf("?"));
	    window.history.replaceState({}, document.title, clean_uri);
    
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
          
          if ("token_type" in res){
            //given token
          //Save tokens in database and set stravaAuthorised to true. THen can make requests.
          //PUT request to "/user" to update user profile.
          fetch("http://localhost:8000/api/v1/user/", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization":getToken(),
            },
            body: JSON.stringify({
              stravaAuthorised:true,
              stravaAccessToken:res["access_token"],
              stravaRefreshToken:res["refresh_token"],
              stravaAccessTokenExpiresAt:res["expires_at"]
            }),
          })
          }
        
          else{//handle errors
            console.log(res)
          }
      
          
          
        }
        catch(e){

        }
      
    });
  }
  const HandleClick = function () {
    //First check if the user is strava_authorised. by calling get on "/user"
    //IF NOT strava authorised, redirected to strava login, url checked and user details modified.
    fetch("http://localhost:8000/api/v1/user/", {
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
          else{
            //get all activites from database (will happen on page load) and make request to strava.
            fetch("http://localhost:8000/api/v1/activity/",{
              method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: getToken(),
            },);
          }
          console.log(userDetails);
        } else {
          //unsuccessful - handle errors
          console.log(res);
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
