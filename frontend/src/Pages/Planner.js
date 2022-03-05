import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIGet } from "../External/ApiHelper";
export default function Planner() {
  const navigate = useNavigate();
  const HandleGoToTrackingClick = function () {
    navigate("/tracking");
  };
  const TestAPI = function () {
    APIGet(
      "http://localhost:8000/api/v1/",
      "workout_plan?code=6",
      true
    ).then((d) => console.log(d));
  };
  return (
    <>
      <h1>Planner</h1>
      {/*7 evenly spaced out cards */}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <h1>Monday</h1>
          </div>
          <div className="col-md">
            <h1>Tuesday</h1>
          </div>
          <div className="col-md">
            <h1>Wednesday</h1>
          </div>
          <div className="col-md">
            <h1>Thurday</h1>
          </div>
          <div className="col-md">
            <h1>Friday</h1>
          </div>
          <div className="col-md">
            <h1>Saturday</h1>
          </div>
          <div className="col-md">
            <h1>Sunday</h1>
          </div>
        </div>
      </div>
      <button onClick={TestAPI} id="LoadWorkoutPlanButton">
        Load workout plan
      </button>
      <button onClick={HandleGoToTrackingClick}>Go to tracking</button>
    </>
  );
}
