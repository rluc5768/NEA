import { getToken, getStravaToken } from "../utils/Token";
//These functions are used to make the other code more readable and shorter.
function setHeader(base_url, tokenNeeded) {
  let header = {
    "Content-Type": "application/json",
  };
  console.log(base_url.includes("localhost"));
  if (base_url.includes("localhost") && tokenNeeded) {
    header["Authorization"] = `Bearer ${getToken()}`;
  } else if (base_url.includes("www.strava.com") && tokenNeeded) {
    header["Authorization"] = `Bearer ${getStravaToken()}`;
  }
  return header;
}
export async function APIPost(base_url, endpoint, body, tokenNeeded) {
  let header = setHeader(base_url, tokenNeeded);
  return fetch(`${base_url}${endpoint}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
  }).then((data) => data.json());
}
export async function APIGet(base_url, endpoint, tokenNeeded) {
  //params passed in url
  let header = setHeader(base_url, tokenNeeded);
  return fetch(`${base_url}${endpoint}`, {
    method: "GET",
    headers: header,
  })
    .then((response) => {
      //https://stackoverflow.com/questions/49902417/how-to-catch-401-error-using-fetch-method-of-javascript
      console.log(response.status);
      if (response.status !== 200) {
        throw new Error(response.status);
      } else {
        return response.json();
      }
    })
    .catch((error) => {
      if (error.message == 401 && base_url.includes("localhost")) {
        //Log out of the website (set logged out to true and remove JWT from session storage.)
        console.log(error);
      }
    });
}
