import {useOutletContext} from "react-router-dom";

function Private(){
    const [userLoggedIn, setUserLoggedIn] = useOutletContext();
    const HandleClick = ()=>{
        sessionStorage.removeItem("token");
        setUserLoggedIn(false);
    }
    return(
    <>
    <h1>Private</h1>
    <button onClick={()=>HandleClick()}>Log out</button>
    </>);
}
export default Private;