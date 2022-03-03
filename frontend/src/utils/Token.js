function getToken() {
    //gets the value of token from session storage.
    try {
      return JSON.parse(sessionStorage.getItem("token"));
    } catch (e) {
      sessionStorage.removeItem("token");
    }
  }
function getStravaToken(){

}
export {getToken, getStravaToken}