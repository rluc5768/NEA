import {getToken, getStravaToken} from "../utils/Token";

export default function APIPost(url, body, external, tokenNeeded){//string : object : bool
  let token;
  let headers = {
    "Content-Type": "application/json",
  };    
  if(tokenNeeded){
    token = !external ? getToken() : getStravaToken();
    headers["Authorisation"] = "Bearer ".concat(token);

  }
  return fetch(url, {
    method:"POST",
    headers: headers,
    body:JSON.stringify(body),
  }).then((data)=>data.json())
  .catch((error)=>{
    //Log user out
  })

}
