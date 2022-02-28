export default function Api(url, body, authorisation, method) {
  //authorisation : boolean (to add the authorization header)
  let header = {
    "Content-Type": "application/json",
  };
  if (authorisation) {
    header["Authorization"] = getToken();
  }
  let content = {
    method: method,
    headers: header,
  };
  if (method == "POST") {
    content["body"] = JSON.stringify(body);
  }
  return fetch(url, content).then((data) => data.json());
}
