"use client";
import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTask, setEditTask] = useState(null);

  // Fetch tasks from the backend
  useEffect(() => {
    async function fetchTasks() {
      try {
        const resp = await fetch("/api/home");
        if (resp.ok) {
          const res = await resp.json();
          setTasks(res);
        } else {
          console.error("Failed to fetch tasks. Response not OK.");
        }
      } catch (e) {
        console.error("Failed to fetch tasks:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const resp = await fetch("/api/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTaskTitle, status: false }),
      });

      if (resp.ok) {
        const { newTask } = await resp.json();
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        setNewTaskTitle("");
      } else {
        console.error("Failed to add task.");
      }
    } catch (e) {
      console.error("Error adding task:", e);
    }
  };

  // Edit an existing task
  const handleEditTask = async () => {
    if (!editTask?.title.trim()) return;

    try {
      const resp = await fetch("/api/home", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editTask.id, title: editTask.title }),
      });

      if (resp.ok) {
        const { updatedTask } = await resp.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setEditTask(null);
      } else {
        console.error("Failed to update task.");
      }
    } catch (e) {
      console.error("Error updating task:", e);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      const resp = await fetch("/api/home", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (resp.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task.");
      }
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Add Task Section */}
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task"
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={handleAddTask}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              {editTask?.id === task.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                    className="border rounded px-2 py-1"
                  />
                  <button
                    onClick={handleEditTask}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditTask(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className={task.status ? "line-through" : ""}>
                    {task.title}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditTask(task)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
