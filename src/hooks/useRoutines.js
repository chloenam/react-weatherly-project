import { useState, useEffect } from "react";

export default function useRoutines() {
  const key = "routines";
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(key)) || [];
    setRoutines(stored);
  }, []);

  const addRoutine = (text) => {
    const newRoutines = [...routines, { text, done: false }];
    setRoutines(newRoutines);
    localStorage.setItem(key, JSON.stringify(newRoutines));
  };

  const toggleRoutine = (index) => {
    const newRoutines = [...routines];
    newRoutines[index].done = !newRoutines[index].done;
    setRoutines(newRoutines);
    localStorage.setItem(key, JSON.stringify(newRoutines));
  };

  const deleteRoutine = (index) => {
    const newRoutines = [...routines];
    newRoutines.splice(index, 1);
    setRoutines(newRoutines);
    localStorage.setItem(key, JSON.stringify(newRoutines));
  };

  return { routines, addRoutine, toggleRoutine, deleteRoutine };
}
