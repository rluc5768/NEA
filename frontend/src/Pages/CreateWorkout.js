import "./CreateWorkout.css";
import { useEffect, useRef, useState } from "react";
import { APIGet, APIPost } from "../External/ApiHelper";
import { useNavigate } from "react-router-dom";
export default function CreateWorkout() {
  const PossibleExercises = useRef();

  const [togglePopUp, setTogglePopUp] = useState(false);
  const [AddExerciseExercise, setAddExerciseExercise] = useState("Bench press");
  const [AddExerciseSets, setAddExerciseSets] = useState();
  const [AddExerciseReps, setAddExerciseReps] = useState();
  const [AddExerciseWeight, setAddExerciseWeight] = useState();

  const [mondayWorkout, setMondayWorkout] = useState([]);
  const [tuesdayWorkout, setTuesdayWorkout] = useState([]);
  const [wednesdayWorkout, setWednesdayWorkout] = useState([]);
  const [thursdayWorkout, setThursdayWorkout] = useState([]);
  const [fridayWorkout, setFridayWorkout] = useState([]);
  const [saturdayWorkout, setSaturdayWorkout] = useState([]);
  const [sundayWorkout, setSundayWorkout] = useState([]);

  const [whichAddButton, setWhichAddButton] = useState();
  const [workoutPlanName, setWorkoutPlanName] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(mondayWorkout);
    //on page load
    APIGet("http://localhost:8000/api/v1/", "exercises", true).then((res) => {
      PossibleExercises.current = res;
      console.log(PossibleExercises.current);
    });
  }, []);
  const HandleAddExercise = function (day) {
    setWhichAddButton(day);
    if (!togglePopUp) {
      setTogglePopUp(true);
    }
  };
  const HandleAddExerciseSubmit = function (e, setStateArr) {
    e.preventDefault();
    setTogglePopUp(false);
    console.dir({
      name: AddExerciseExercise,
      sets: AddExerciseSets,
      reps: AddExerciseReps,
      weight: AddExerciseWeight,
    });
    //Check all fields are filled in
    if (
      AddExerciseExercise == undefined ||
      AddExerciseSets == undefined ||
      AddExerciseReps == undefined ||
      AddExerciseWeight == undefined
    ) {
      return;
    }

    setStateArr((stateArr) => [
      ...stateArr,
      {
        name: AddExerciseExercise,
        sets: AddExerciseSets,
        reps: AddExerciseReps,
        weight: AddExerciseWeight,
      },
    ]);
  };

  const HandleWorkoutPlanSave = function (e) {
    e.preventDefault();
    if (workoutPlanName == "" || workoutPlanName == undefined) {
      alert("The workout plan must have a name.");
      return;
    }
    let plan = {
      Monday: mondayWorkout,
      Tuesday: tuesdayWorkout,
      Wednesday: wednesdayWorkout,
      Thursday: thursdayWorkout,
      Friday: fridayWorkout,
      Saturday: saturdayWorkout,
      Sunday: sundayWorkout,
    };

    let daysOfTheWeek = "";
    let allEmptyFlag = true;
    Object.keys(plan).map((key) => {
      if (plan[key].length == 0) daysOfTheWeek += "0";
      else {
        daysOfTheWeek += "1";
        allEmptyFlag = false;
      }
    });
    if (allEmptyFlag) {
      alert("Some workout must be entered.");
      return;
    }
    let workout_plan = {
      name: workoutPlanName,
      daysOfTheWeek: daysOfTheWeek,
      plan: plan,
    };

    APIPost(
      "http://localhost:8000/api/v1/",
      "workout_plan",
      workout_plan,
      true
    ).then((res) => {
      //Change active workout to the one just created and navigate to /workout_planner.abs
      navigate("/workout_planner");
    });
  };

  return (
    <>
      {togglePopUp && (
        <div id="AddExercisePopUp" className="text-center">
          <h1 className="text-center">Add Exercise</h1>
          <form
            onSubmit={(e) => {
              HandleAddExerciseSubmit(e, eval(`set${whichAddButton}Workout`));
            }}
            id="AddExerciseForm"
            className="text-center"
          >
            <label>Exercise</label>
            <select
              value={AddExerciseExercise}
              onChange={(e) => setAddExerciseExercise(e.target.value)}
            >
              {Object.keys(PossibleExercises.current).map((exercise) => {
                //Returns array of keys
                return <option value={exercise}>{exercise}</option>;
              })}
            </select>
            <label>Sets</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setAddExerciseSets(e.target.value)}
            />
            <label>Reps</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setAddExerciseReps(e.target.value)}
            />
            <label>Weight</label>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setAddExerciseWeight(e.target.value)}
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-success col-sm-6 center"
            />
          </form>
          <button
            onClick={() => setTogglePopUp(!togglePopUp)}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      )}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md text-center">
            <h1>Monday</h1>
            <ul className="list-group">
              {mondayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Monday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Tuesday</h1>
            <ul>
              {tuesdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Tuesday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Wednesday</h1>
            <ul>
              {wednesdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Wednesday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Thurday</h1>
            <ul>
              {thursdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Thursday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Friday</h1>
            <ul>
              {fridayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Friday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Saturday</h1>
            <ul>
              {saturdayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Saturday")}
            >
              Add exercise
            </button>
          </div>
          <div className="col-md text-center">
            <h1>Sunday</h1>
            <ul>
              {sundayWorkout.map((element) => (
                <li className="list-group-item">{`${element.name}-${element.sets}x${element.reps}-${element.weight}`}</li>
              ))}
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => HandleAddExercise("Sunday")}
            >
              Add exercise
            </button>
          </div>
        </div>
      </div>
      <form onSubmit={(e) => HandleWorkoutPlanSave(e)}>
        <label>Name</label>
        <input
          type="text"
          onChange={(e) => setWorkoutPlanName(e.target.value)}
        />
        <input type="submit" className="btn btn-success" />
      </form>
    </>
  );
}
