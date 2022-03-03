import { useRef } from "react";
import { getToken } from "../utils/Token";
export default function DeleteAccount(props){
    const confirmation = useRef("");
    const HandleSubmit = (e) => {
        //prevents page re-render
        console.log(confirmation.current);
        if(confirmation.current == "Delete_".concat(props.username)){//Confirmation valid, DELETE request to "/user"
            console.log("DELETE")
            fetch("http://localhost:8000/api/v1/user/", {
                method:"DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer ".concat(getToken()),
                },

            }).then((data)=>data.json())
            .then((res) => {
                console.log(res);
                if(res["type"] == "delete_confirmation"){
                    sessionStorage.removeItem("token");
                    props.LogUserInOrOut(false); 
                }
            })
            .catch((error) => {
                console.log(error);
                if(error.response.status == 401) {props.LogUserInOrOut(false);}
            })
        }
        else{//invalid confirmation

        }
    }
    return (
        <form onSubmit={e => {e.preventDefault();HandleSubmit(e);}}>
            <label>Confirm by typing "Delete_{props.username}": </label>
            <input type="text" onChange={(e) => {
                confirmation.current = (e.target.value);
            }}/>
            <input type="submit" value="Submit"/>
        </form>
    
        );
}