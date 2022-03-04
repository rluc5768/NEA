import "./ActivityList.css";
export default function ActivityList(props) {
  const HandleClick = function(){
    //Display route and summary.
    console.log(props.activities)
  }
  return (
    <>
    <button onClick={HandleClick}>CLICK</button>
    <ul className="list-group overflow-auto text-center" id="activity-list">



      
      
      
      {/*<li className="list-group-item" onClick={HandleClick}>oh no</li>*/}
      
    </ul>
    
    </>
  );
}
