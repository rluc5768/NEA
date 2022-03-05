import "./ActivityList.css";
export default function ActivityList(props) {
  const HandleClick = function () {
    //Display route and summary.
    console.log(props.activities);
    console.log(props);
  };
  return (
    <>
      <button onClick={HandleClick}>CLICK</button>
      {props.activites != null && <p>{Object.keys(props.activities)}</p>}
      <p>HI</p>
      {/*<ul className="list-group overflow-auto text-center" id="activity-list">



      
      
      
      {<li className="list-group-item" onClick={HandleClick}>oh no</li>}
      
    </ul>*/}
    </>
  );
}
