export default function getToken() {
  return JSON.parse(sessionStorage.getItem("token"));
}
