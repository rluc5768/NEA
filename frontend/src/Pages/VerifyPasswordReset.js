import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ValidateInputs from "../External/InputValidationClass";
export default function VerifyPasswordReset(props){
    const {username} = useParams();
    const [searchParams] = useSearchParams();
    const[pageLoaded, setPageLoaded] = useState("loading");
    const [inputType, setInputType] = useState("password");
    const validUUID = useRef("");
    const password1 = useRef();
    const password2 = useRef();
    const navigate = useNavigate();
    
    useEffect(()=>{
        let uuid = searchParams.get("uuid");
    if(uuid != null){
        //Get uuid from database.
        fetch("http://localhost:8000/api/v1/uuid/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({"username":username})
        }).then((data)=>data.json())
        .then((res)=>{
            console.log(res);
            console.dir(username);
            if(res["type"] == "success"){//Use UUID here.
                
                if(uuid == res["uuid"]){//The uuid is the same so is valid.
                    validUUID.current = uuid;
                    setPageLoaded("valid")
                }
                else{
                    setPageLoaded("invalid");
                }
            }
            else{
                setPageLoaded("invalid");
            }
        });
    }
    else{
        setPageLoaded("invalid");
    }

},[]);

const ToggleInputType = function() {
    if(inputType == "password"){
        setInputType("text");
    }
    else{
        setInputType("password");
    }
}
    const HandleSubmit = function(e){
        e.preventDefault();
        if(password1.current == password2.current){//Passwords match so exchange UUID for JWT and update database.
            if(ValidateInputs.validatePassword(password1.current) && ValidateInputs.validatePassword(password2.current)){//Passwords are both valid. (validate on backend as well).

            if(validUUID.current != ""){
            fetch("http://localhost:8000/api/v1/exchangeUUID/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "username":username, 
                    "uuid":validUUID.current
                })
            }).then(data => data.json())
            .then((res) => {
                console.log(res);
                if (res["type"] == "auth_token"){
                    console.log("auth_token"+res["token"]);
                    sessionStorage.setItem("token", JSON.stringify(res["token"]));
                    props.LogUserInOrOut(true);
                    fetch("http://localhost:8000/api/v1/user/",{
                        method:"PUT",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":"Bearer ".concat(res["token"])
                        },
                        body:JSON.stringify({
                            "password":password1.current,
                        })
                    })
                    .then(data=>data.json())
                    .then(response => {
                        navigate("/home");
                    })
                }
                else{
                    setPageLoaded("invalid")
                }
            });
            
        }
    }
        
        else{
            alert("Passwords must match.")
        }
    }
}
    if(pageLoaded == "loading"){
        return <h1>pageLoaded</h1>;
    }
    return(
    <>
    {pageLoaded == "valid"?
    <>
    <h1>Confirm password reset</h1>
    <form>
        <label>New password:</label>
        <input type={inputType} onChange={(e) => {
            password1.current = e.target.value;
        }}/>
        <label>Re-enter password:</label>
        <input type={inputType} onChange={(e) => {
            password2.current = e.target.value;
        }}/>
        <input type="submit" onClick={(e) => {
            HandleSubmit(e);
        }}/>
        <button type="button" onClick={ToggleInputType}>View Password</button>
    </form> 
    </>
    : <h1>An error has occured, try again.</h1>
}
    
    </>
    );
}