import { useState } from "react";
import { APIPost, APIGet } from "../External/ApiHelper";
import { useNavigate } from "react-router-dom";
export default function Tracking() {
  const [personalBests, setPersonalBests] = useState();
  const navigate = useNavigate();
  const HandleClick = function () {
    APIGet("local", "personal_bests/", true).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <button onClick={HandleClick}>Fool</button>
      <h1>Tracking</h1>
      <h2>Personal Bests</h2>
      <button onClick={() => navigate("/workout_planner")}>Go back</button>
    </>
  );
}
