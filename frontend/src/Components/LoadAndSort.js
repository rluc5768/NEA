function getToken() {
  //gets the value of token from session storage.
  try {
    return JSON.parse(sessionStorage.getItem("token"));
  } catch (e) {
    sessionStorage.removeItem("token");
  }
}
export default function LoadAndSort() {
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
      .then((res) => console.log(res));
  };
  return (
    <button className="btn btn-primary" onClick={HandleClick}>
      Load
    </button>
  );
}
