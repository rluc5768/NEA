export default function ResetPassword(props){
    const HandlePasswordReset = () => {
        fetch("http://localhost:8000/api/v1/uuidAndEmail/", {
        method:"POST",    
        headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({"username":props.username})
        }).then((data)=>data.json());
    }
    return(
            <button onClick={HandlePasswordReset}>Confirm password reset</button>
        );
}