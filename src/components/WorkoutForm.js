import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [err, setErr] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    //to prevent the submition of the form
    e.preventDefault();

    if (!user) {
      setErr("you must be logged in");
      return;
    }

    const workout = { title, load, reps };

    const res = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      setErr(json.err);
      setEmptyFields(json.emptyFields);
    }
    if (res.ok) {
      //erase the workout
      setTitle("");
      setLoad("");
      setReps("");
      setErr(null);
      setEmptyFields([]);
      console.log("new workout added", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new workout</h3>
      <lable>Exercice Title:</lable>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "err" : ""}
      />

      <lable>Exercice Load (KG):</lable>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "err" : ""}
      />

      <lable>Exercice Reps:</lable>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "err" : ""}
      />

      <button>Submit</button>
      {err && <div className="err">{err}</div>}
    </form>
  );
};

export default WorkoutForm;
