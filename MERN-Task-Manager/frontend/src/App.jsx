import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");

  const API_URL = "http://localhost:8000";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await axios.post(`${API_URL}/tasks`, {
        title: taskTitle,
      });

      setTaskTitle("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      {/* Navbar */}

      <nav className="navbar">
        <div className="nav-container">
          <h2>TaskFlow</h2>
          <p>MERN Task Manager</p>
        </div>
      </nav>

      {/* Hero */}

      <section className="hero">
        <div className="hero-content">
          <h1>Organize Your Daily Tasks Easily</h1>

          <p>
            A modern MERN stack task management application where users can add,
            complete, and delete tasks efficiently.
          </p>
        </div>
      </section>

      {/* Main */}

      <main className="main-container">
        <div className="task-input-box">
          <input
            type="text"
            placeholder="Enter your task..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <div className="empty-box">
              <p>No tasks added yet.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div className="task-info">
                  <h3 className={task.completed ? "completed" : ""}>
                    {task.title}
                  </h3>

                  <span>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="task-buttons">
                <button
                  className={
                    task.completed ? "pending-btn" : "complete-btn"
                  }
                  onClick={() => toggleTask(task._id)}
                >
                  {task.completed ? "Mark Pending" : "Mark Complete"}
                </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;