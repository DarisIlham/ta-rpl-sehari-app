import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import amazing from "../images/Space.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
}

function Dash() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Work");
  const [activeSection, setActiveSection] = useState("General Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTaskId, setActiveTaskId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  //   const [showColorPicker, setShowColorPicker] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchTasks = async () => {
    try {
      const response = await api.get("/");
      // Ensure we always have an array
      const data = Array.isArray(response.data) ? response.data : [];
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Fallback to empty array on error
    }
  };
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api/tasks`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const menuRef = useRef(null);
  const [wallpapers] = useState([
    {
      id: 2,
      name: "Space",
      image: amazing,
      thumbnailClass: "bg-gray-800",
      darkText: true, // Flag for dark backgrounds
    },
  ]);

  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);
  const isImageBackground = !!selectedWallpaper.image;
  //   const isDarkBackground = selectedWallpaper.darkText || false;

  const sections = ["General Tasks", "Daily", "Work"];
  const categories = ["Work", "Personal", "Me Time", "Project"];
  const statuses = ["Upcoming", "Ongoing", "Complete"];
  const [colorOptions] = useState([
    "bg-[#32576d]",
    "bg-[#2d6348]",
    "bg-[#95713a]",
    "bg-[#7f4140]",
    "bg-[#593f73]",
    "bg-[#3f4a73]",
  ]);

  useClickOutside(menuRef, () => {
    setActiveTaskId(null);
  });

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const [hours, minutes] = newTaskTime.split(":").map(Number);
        const now = new Date();

        const taskTime = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        );

        // Format waktu menjadi "HH:mm"
        const timeFormatted = taskTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // gunakan 24 jam
        });

        const taskData = {
          name: newTask,
          time: taskTime, // objek Date asli (jika masih dibutuhkan)
          timeString: timeFormatted, // tambahkan format jam:menit
          category: newTaskCategory,
          status: "Upcoming",
          section: activeSection,
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        };

        const response = await api.post("/", taskData);
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // const updateTaskStatus = async (id, newStatus) => {
  //   try {
  //     await api.put(`/${id}`, { status: newStatus });
  //     setTasks(
  //       tasks.map((task) =>
  //         task.task_id === id ? { ...task, status: newStatus } : task
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating task status:", error);
  //   }
  // };

  const profileNavigate = (e) => {
    e.preventDefault();
    navigate("/profile");
  };
  const updateTaskColor = (id, newColor) => {
    setTasks(
      tasks.map((task) =>
        task.task_id === id ? { ...task, color: newColor } : task
      )
    );
  };

  const removeTask = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTasks(tasks.filter((task) => task.task_id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Find the task being moved
    const taskToUpdate = tasks.find(
      (task) =>
        task.status === source.droppableId &&
        task.task_id.toString() === result.draggableId
    );

    if (!taskToUpdate) return;

    // Map frontend status to backend status

    if (source.droppableId !== destination.droppableId) {
      try {
        // Directly using the status value (no mapping needed)
        await api.put(`/drag/${taskToUpdate.task_id}`, {
          status: destination.droppableId,
        });

        setTasks(
          tasks.map((task) =>
            task.task_id === taskToUpdate.task_id
              ? { ...task, status: destination.droppableId }
              : task
          )
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    } else {
      // Handle reordering within the same column
      const newTasks = [...tasks];
      const filteredTasks = newTasks.filter(
        (task) => task.status === source.droppableId
      );

      const [removed] = filteredTasks.splice(source.index, 1);
      filteredTasks.splice(destination.index, 0, removed);

      const updatedTasks = newTasks.map((task) =>
        task.status === source.droppableId ? filteredTasks.shift() : task
      );

      setTasks(updatedTasks);
    }
  };

  const filteredTasks = (tasks || []).filter((task) => {
    const matchesSection =
      activeSection === "General Tasks" || task.section === activeSection;
    const matchesSearch = task.name
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const tasksByStatus = (status) => {
    return (filteredTasks || [])
      .filter((task) => task.status === status)
      .sort((a, b) => new Date(a.time) - new Date(b.time)); // urutkan berdasar waktu sebenarnya
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className={`max-h-screen`}>
      {/* Header */}
      <header className="bg-[#202020] text-white p-4 shadow-lg h-[56px]">
        <h1 className="text-xl font-bold">
          Upcoming Today Task:{" "}
          {tasksByStatus("Upcoming")[0]?.text || "No upcoming tasks"}
        </h1>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)]">
        {/* Sidebar */}

        <div className="w-100 h-full bg-[#202020]  flex flex-col gap-4 shadow-md z-10">
          <div className="mt-1">
            {" "}
            {/* Puts it at the bottom */}
            <h3 className="text-xl font-medium text-white mb-2 p-4">Wallpaper</h3>
            <div className="flex flex-wrap gap-2 p-4">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => setSelectedWallpaper(wallpaper)}
                  className={`w-45 h-10 rounded-md border-2 overflow-hidden  ${
                    selectedWallpaper.id === wallpaper.id
                      ? "border-white ring-2 ring-slate-200"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  title={wallpaper.name}
                >
                  {wallpaper.image ? (
                    <img
                      src={wallpaper.image}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${wallpaper.thumbnailClass}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Add Task Form */}
          <div className="space-y-2  mt-[-16px] border-slate-200 p-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task ..."
              className="w-full border-b p-2 text-2xl mb-5 border-slate-200 bg-[#202020] bg-opacity-90 text-white  hover:text-white transition"
            />
            <div className="flex gap-5">
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="p-2  flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 focus:outline-none text-white  hover:text-white transition"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="p-2  flex-1 text-xl mb-5 bg-[#202020] border-b border-slate-200 bg-opacity-90 focus:outline-none text-white  hover:text-white transition"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={addTask}
              className="w-full bg-[#000000] hover:bg-slate-200 hover:text-[#202020] transition bg-opacity-85 mb-1 text-2xl text-white p-2 rounded-xl  "
            >
              Add Task
            </button>
          </div>

          {/* Search */}
          <div className=" mx-4">
            <input
              type="text"
              placeholder="Find Task"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-b p-2 text-xl mb-1  bg-[#202020] bg-opacity-90 text-white  "
            />
          </div>

          {/* Sections */}
          <div className="space-y-1 text-white text-xl p-4">
            {sections.map((section) => (
              <button
                key={section}
                className={`w-full text-left p-2 rounded transition ${
                  activeSection === section
                    ? "bg-[#383838] "
                    : "hover:bg-[#383838]"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={profileNavigate}
              className="fixed w-100  bg-[#2f2f2f] bottom-0 left-0 flex items-center gap-2 text-xl text-white py-2  hover:bg-slate-200 hover:text-[#202020] transition "
            >
              <FaUser className="text-white ml-5" /> {/* ikon user */}
              Profile
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 p-4 overflow-auto transition-all duration-500"
          style={
            isImageBackground
              ? {
                  backgroundImage: `url(${selectedWallpaper.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }
              : { background: selectedWallpaper.class }
          }
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statuses.map((status) => (
                <Droppable key={status} droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-[#2f2f2f] text-[#dbe4e0] rounded-lg shadow p-4"
                    >
                      <h2 className="font-bold text-lg mb-4 pb-2 border-b">
                        {status}
                      </h2>
                      <div className="space-y-3">
                        {tasksByStatus(status).map((task, index) => (
                          <Draggable
                            key={task.task_id}
                            draggableId={task.task_id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative border rounded-lg p-3 shadow-sm transition-all duration-200 ease-in-out
                     ${task.color || "bg-red-500"} 
                     ${
                       snapshot.isDragging
                         ? "transform scale-105 shadow-lg z-10"
                         : ""
                     }
                     ${
                       activeTaskId === task.task_id ? "ring-2 ring-white" : ""
                     }`}
                                onClick={() =>
                                  setActiveTaskId(
                                    task.task_id === activeTaskId
                                      ? null
                                      : task.task_id
                                  )
                                }
                              >
                                {/* Task content */}
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-medium text-[#dbe4e0]">
                                    {task.name}
                                  </h3>
                                  <span className="text-sm text-[#dbe4e0]">
                                    {new Date(task.time).toLocaleString(
                                      "en-EN",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-[#dbe4e0] mb-3">
                                  <span>{task.category}</span>
                                  <span>{task.section}</span>
                                </div>

                                {/* Context menu */}
                                {activeTaskId === task.task_id && (
                                  <div
                                    ref={menuRef}
                                    className="absolute right-0 top-full mt-1 bg-[#3b3b3b] shadow-xl rounded-md p-3 z-20 w-72 "
                                  >
                                    <h4 className="text-sm font-semibold text-white mb-3 px-2">
                                      Task Actions
                                    </h4>

                                    <div className="mb-4">
                                      <p className="text-sm text-white px-2 mb-2">
                                        Change Color:
                                      </p>
                                      <div className="flex flex-wrap gap-3 p-1">
                                        {colorOptions.map((color) => (
                                          <button
                                            key={color}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updateTaskColor(
                                                task.task_id,
                                                color
                                              );
                                              setActiveTaskId(null);
                                            }}
                                            className={`w-8 h-8 rounded-full ${color} cursor-pointer hover:opacity-80 transition-all
                       ${
                         task.color === color
                           ? "ring-2 ring-gray-500 scale-110"
                           : "ring-1 ring-gray-300"
                       }`}
                                            aria-label={`Change to ${color
                                              .replace("bg-", "")
                                              .replace("-100", "")}`}
                                          />
                                        ))}
                                      </div>
                                    </div>

                                    <div className="border-t pt-3 space-y-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeTask(task.task_id);
                                        }}
                                        className="w-full text-left text-sm bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2.5 rounded-lg transition flex items-center gap-2"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        Delete Task
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default Dash;
