import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIGet, APIPost } from "../External/ApiHelper";
export default function Planner() {
  const [workoutPlanLoaded, setWorkoutPlanLoaded] = useState();
  const [mondayWorkout, setMondayWorkout] = useState([]);
  const [tuesdayWorkout, setTuesdayWorkout] = useState([]);
  const [wednesdayWorkout, setWednesdayWorkout] = useState([]);
  const [thursdayWorkout, setThursdayWorkout] = useState([]);
  const [fridayWorkout, setFridayWorkout] = useState([]);
  const [saturdayWorkout, setSaturdayWorkout] = useState([]);
  const [sundayWorkout, setSundayWorkout] = useState([]);
  const navigate = useNavigate();
  const HandleGoToTrackingClick = function () {
    navigate("/tracking");
  };
  const TestAPI = function () {
    APIGet(
      "http://localhost:8000/api/v1/",
      "workout_plan?workout_plan=No",
      true
    ).then(
      //Pass LogUserInOrOut into function.
      (data) => {
        if (data !== undefined) {
          //from the catch block
          console.log(data);
        }
      }
    );
  };

  useEffect(() => {
    //if workout is empty, dsiplay page no current active workout plan.
    APIGet("http://localhost:8000/api/v1/", "workout_plan", true).then(
      (res) => {
        console.log(res);
        Object.keys(res["plan"]).map((key) => {
          eval(`set${key}Workout(${res["plan"[key]]})`);
        });
      }
    );
  }, []);

  const HandleCreateWorkoutPlan = function () {
    navigate("/workout_planner/create");
  };
  return (
    <>
      <h1 className="text-center">Planner</h1>
      {/*7 evenly spaced out cards */}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md text-center">
            <h2>Monday</h2>
            <ul>
              {mondayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Tuesday</h2>
            <ul>
              {tuesdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Wednesday</h2>
            <ul>
              {wednesdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Thurday</h2>
            <ul>
              {thursdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Friday</h2>
            <ul>
              {fridayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Saturday</h2>
            <ul>
              {saturdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
          <div className="col-md text-center">
            <h2>Sunday</h2>
            <ul>
              {sundayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md text-center">
            <button
              onClick={TestAPI}
              id="LoadWorkoutPlanButton"
              className="btn btn-success"
            >
              Load workout plan
            </button>
          </div>
          <div className="col-md text-center">
            <button
              onClick={HandleCreateWorkoutPlan}
              className="btn btn-success"
            >
              Create workout plan
            </button>
          </div>
          <div className="col-md text-center">
            <button
              onClick={HandleGoToTrackingClick}
              className="btn btn-success"
            >
              Go to tracking
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
