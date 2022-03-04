import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {getToken} from "../utils/Token";

export default function Account(props){
    const[pageState, setPageState] = useState("loading");
    const username = useRef("");
    const email = useRef("");
    const fname = useRef("");
    const sname = useRef("");
    const navigate = useNavigate();
    useEffect(()=>{
        //API call to get "/user".
        let token = "Bearer ".concat(getToken());
        fetch("http://localhost:8000/api/v1/user/",{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        }).then((data)=>data.json())
        .then((res)=>{
            if(res["type"] == "user_details" ){
                let details = res["details"];
                username.current = details["username"];
                email.current=details["email"];
                fname.current = details["firstName"];
                sname.current=details["surname"];
            }
            setPageState("loaded");
            
        }).catch((error) => {
            if(error.response.status == 401){
                props.LogUserInOrOut(false);
            }
        })
    });

const HandleLogout = ()=>{
    sessionStorage.removeItem("token");
    props.LogUserInOrOut(false);
}
const HandleDeleteAccount = () => {// DELETE request to "/user"
    //Confirm by typing "Delete_{username}"
    
    //setOptionClicked(true);
    navigate("/account/deleteAccount");
}
    const HandleChangePassword = () => {
        navigate("/account/resetPassword");
    }
    if(pageState=="loading"){
        return <h1>Loading</h1>;
    }
    return(
    <>
        <h1>Details</h1>
        <h2>Account: {props.username}</h2>
        <h2>Email: {email.current}</h2>
        <h2>First Name: {fname.current}</h2>
        <h2>Surname: {sname.current}</h2>
        
        <button onClick={HandleLogout}>Logout</button>
        <button onClick={HandleDeleteAccount}>Delete Account</button>
        <button onClick={HandleChangePassword}>Change Password</button>
        <Outlet/>
    </>
    );
}