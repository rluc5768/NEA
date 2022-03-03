export default function DeleteAccount(props){
    return (
        <form>
            <label>Confirm by typing: Delete_{props.username}</label>
            <input type="text" />
        </form>
    
        );
}