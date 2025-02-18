"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import { FaPlus, FaSpinner } from "react-icons/fa";
import Navbar from "@/components/Navbar";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [energyLevel, setEnergyLevel] = useState("");
  const [optimizedTasks, setOptimizedTasks] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizedTasks, setShowOptimizedTasks] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        const resp = await fetch("/api/home");
        if (resp.ok) {
          const res = await resp.json();
          setTasks(res);
        } else {
          console.error("Failed to fetch tasks.");
        }
      } catch (e) {
        console.error("Failed to fetch tasks:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const resp = await fetch("/api/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle, status: false }),
      });
      if (resp.ok) {
        const { newTask } = await resp.json();
        setTasks((prevTasks) => [newTask, ...prevTasks]);
        setNewTaskTitle("");
      }
    } catch (e) {
      console.error("Error adding task:", e);
    }
  };

  const handleEditTask = async () => {
    if (!editTask?.title.trim()) return;
    try {
      const resp = await fetch("/api/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTask.id, title: editTask.title }),
      });
      if (resp.ok) {
        const { updatedTask } = await resp.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        setEditTask(null);
      }
    } catch (e) {
      console.error("Error editing task:", e);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const resp = await fetch("/api/home", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (resp.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  // const handleOptimizeTasks = async () => {
  //     if (!energyLevel.trim()) return;
  //     setIsOptimizing(true);
  //     setShowOptimizedTasks(false);
  //     try {
  //         const response = await axios.post(
  //             "https://api.openai.com/v1/chat/completions",
  //             {
  //                 model: "gpt-4o-mini",
  //                 messages: [
  //                     {
  //                         role: "system",
  //                         content: "Optimize tasks based on energy levels and time.Be to the point without markup.",
  //                     },
  //                     {
  //                         role: "user",
  //                         content: `Tasks: ${tasks.map((task) => task.title).join(", ")}. Energy level: ${energyLevel}`,
  //                     },
  //                 ],
  //                 temperature: 0.7,
  //             },
  //             {
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                     Authorization: `Bearer ${process.env.NEXT_PUBLIC_REACT_APP_OPENAI_API_KEY}`,
  //                 },
  //             }
  //         );

  //         const optimizedList =
  //             response.data.choices[0]?.message?.content || "No optimized tasks.";
  //         setOptimizedTasks(optimizedList.split("\n").filter((task) => task.trim()));
  //         setShowOptimizedTasks(true);
  //     } catch (e) {
  //         console.error("Error optimizing tasks:", e);
  //         if (e.response?.status === 429) {
  //             setRateLimitReached(true);
  //         }
  //     } finally {
  //         setIsOptimizing(false);
  //     }
  // };
  const handleOptimizeTasks = async () => {
    if (!energyLevel.trim()) return;
    setIsOptimizing(true);
    setShowOptimizedTasks(false);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions", // OpenAI's free tier endpoint
        {
          model: "gpt-3.5-turbo", // Use a free or low-cost model
          messages: [
            {
              role: "system",
              content:
                "Optimize tasks based on energy levels and time. Be to the point without markup.",
            },
            {
              role: "user",
              content: `Tasks: ${tasks
                .map((task) => task.title)
                .join(", ")}. Energy level: ${energyLevel}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REACT_APP_OPENAI_API_KEY}`, // Use your OpenAI API key
          },
        }
      );

      const optimizedList =
        response.data.choices[0]?.message?.content || "No optimized tasks.";
      setOptimizedTasks(
        optimizedList.split("\n").filter((task) => task.trim())
      );
      setShowOptimizedTasks(true);
    } catch (e) {
      console.error("Error optimizing tasks:", e);
      if (e.response) {
        console.error("Response data:", e.response.data);
        console.error("Response status:", e.response.status);
        console.error("Response headers:", e.response.headers);
      }
      if (e.response?.status === 429) {
        setRateLimitReached(true);
      } else if (e.response?.status === 402) {
        console.error(
          "Payment required. Check your account balance or billing details."
        );
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow min-w-[30rem] mx-auto p-6 mb-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-lg mt-8">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <FaPlus /> Add
          </motion.button>
        </div>

        {/* Task List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-3 rounded-md shadow-md flex justify-between"
                >
                  {editTask?.id === task.id ? (
                    <>
                      <input
                        value={editTask.title}
                        onChange={(e) =>
                          setEditTask({ ...editTask, title: e.target.value })
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                      <FiSave
                        onClick={handleEditTask}
                        className="text-green-500 cursor-pointer"
                      />
                    </>
                  ) : (
                    <>
                      <span>{task.title}</span>
                      <div className="flex gap-2">
                        <FiEdit
                          onClick={() => setEditTask(task)}
                          className="text-yellow-500 cursor-pointer"
                        />
                        <FiTrash2
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 cursor-pointer"
                        />
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Optimize Tasks */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Optimize Tasks</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              placeholder="Energy Level (Low, Medium, High) and time (morning etc.)"
              className="w-full px-3 py-2 border rounded-md text-xs"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleOptimizeTasks}
              className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              {isOptimizing ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                "Optimize"
              )}
            </motion.button>
          </div>

          {/* Optimized Tasks */}
          <AnimatePresence>
            {showOptimizedTasks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <h3 className="font-semibold mb-2">Optimized Tasks</h3>
                <ul>
                  {optimizedTasks.map((task, idx) => (
                    <li key={idx} className="bg-gray-100 rounded p-2 mb-1">
                      {task}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowOptimizedTasks(false)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rate Limit Popup */}
      {rateLimitReached && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 text-red-500 font-semibold">
              Oops, OpenAI rate limit reached!
            </p>
            <button
              onClick={() => setRateLimitReached(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
