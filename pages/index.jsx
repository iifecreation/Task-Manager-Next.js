import { useState, useEffect } from "react";
import "../app/globals.css"
import Image from "next/image";

export default function Home(){
    const[tasks, setTasks] = useState([]) // Array to store tasks
    const[newTask, setNewTask] = useState('') // Store new task title as string
    const[newDescription, setNewDescription] = useState('') // Store new task description as string
    const[filter, setFilter] = useState('all') // store the current selected filter for filter selection
    const[activeTask, setActiveTask] = useState(null) // store which Task is selected by user to perform action like delete on
    const[newTaskMenu, setNewTaskMenu] = useState(false) // store the state of new task menu

    useEffect(() => {
        fetchTasks()
    }, [])

    // a function to call api to fetch tasks from db
    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/task") // call api with desired routes
            const data = await res.json() // use res as json type and store it on data constant variable
            setTasks(data) // call setTask to store data return from the api call
        } catch (error) {
            console.log("unable to connect", error); 
        }
    }

    // a function to call api to add new task to DB
    const addTask = async () => {
        if(!newTask.trim()) return;

        try {
            await fetch("/api/task", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({title: newTask.trim(), description: newDescription.trim()})
            })
            setNewTask('') // clear new typed task 
            setNewDescription('') // clear new typed description
            fetchTasks() //calling fetch tasks  
        } catch (error) {
            console.log("unable to connect", error);
        }
    }

    // a function  to call api to change the state of task
    const toggleTask = async (id, status) => {
        try {
            await fetch(`/api/task?id=${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({status: status})
            })
            fetchTasks() //calling fetch tasks 
        } catch (error) {
            console.log("unable to connect", error);
        }
    }

    // a function  to call api to delete task
    const deleteTask = async (id) => {
        try {
            await fetch(`/api/task?id=${id}`, {
                method: "DELETE"
            })
            fetchTasks() //calling fetch tasks 
        } catch (error) {
            console.log("unable to connect", error);
        }
    }

    // a function for filtering the task in UI
    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true
        return task.status === filter
    })

    console.log(filteredTasks);
    

    return(
        <div className="bg-slate-50">
            {/* header section  to show profile pic and() => set  new task button  */}
            <div className="grid grid-flow-col justify-between px-3 mb-4 pt-3 pb-3">
                <div className="text-black">
                    <Image src="/profile.png" alt="profile pic" className="rounded-full h-[60px] object-cover" width={60} height={60} />
                </div>
                <button className="text-white bg-black px-6 py-3 rounded-full text-2xl" onClick={() => setNewTaskMenu(true)}>+</button>
            </div>

            {/* Section to add new task  */}
            {newTaskMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-40">
                    <div className="bg-white w-3/4 max-w-md mx-auto rounded-lg p-6 text-center space-y-3 space-x-2">
                        <h1 className="text-gray-700 text-2xl">Add new Tasks</h1>
                        <input type="text" 
                            className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
                            placeholder="Task Title"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />

                        <input type="text" 
                            className="border p-2 w-full bg-gray-50 border-gray-600 rounded-2xl placeholder:text-gray-400 text-gray-800"
                            placeholder="Task Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />

                        <button
                            className="bg-green-500 text-white w-1/2 mx-auto px-4 py-2 rounded-full"
                            onClick={addTask}
                            >
                                Add Task
                        </button>

                        <button
                            className="border-2 border-red-500 text-red-500 w-1/2 mx-auto px-4 py-2 rounded-full"
                            onClick={() => setNewTaskMenu(false)}
                            >
                                Close
                        </button>
                    </div>
                </div>
            )}

            {/* section to show filter menu  */}
            <div className="filter-section grid grid-flow-col px-3 space-x-2 pb-4">
                <button className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'}`}
                        onClick={() => setFilter("all")}
                    >
                    All
                </button>

                <button className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'}`}
                        onClick={() => setFilter("done")}
                    >
                    Done
                </button>

                <button className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'}`}
                        onClick={() => setFilter("in-progress")}
                    >
                    In Progress
                </button>

                <button className={`filter-btn px-4 py-2 text-xs text-gray-600 ${filter === 'all' ? 'border-2 border-gray-600 rounded-full text-gray-800' : 'border-2 border-gray-700 rounded-full text-gray-600'}`}
                        onClick={() => setFilter("under-review")}
                    >+ Under Review
                </button>
            </div>

            {/* section to show tasks  */}
            <ul className="grid">
                {
                    filteredTasks.map((task) => 
                        <li key={task._id} data-status={task.status === "done" ? "done" : task.status === "under-review" ? "under-review": "in-progress"}
                            className={`relative grid grid-flow-row items-center mb-1 rounded-3xl text-lg ${task.status ==="done" ? "bg-green-500" : task.status === 'under-review' ? "bg-slate-400" : "bg-cyan-600"} m-2 px-4 font-light`}
                        >
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <div className="mt-4 pb-4 text-gray-100">
                                        <div className="flex-1">
                                            {task.title}
                                        </div>
                                        <div className="text-xs mt-6">{task.description}</div>
                                    </div>
                                </div>

                                <div className="grid cursor-pointer" onClick={() => setActiveTask(task._id)}>
                                    <div className="text-center text-xs text-gray-50 border-2 border-gray-50 m-auto px-3 py-1 rounded-full">
                                        {task.status === 'done' ? "Done" : task.status === "under-review" ? "Under-Review" : "In Progress"}
                                    </div>
                                </div>
                            </div>

                            {/* Full screen pop up modal for actions menu  */}
                            {
                                activeTask === task._id && (
                                    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 flex flex-col justify-center items-center p-4 z-20">
                                        <div className="grid grid-flow-row space-y-2 text-balse">
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-full"
                                                onClick={() => {
                                                    toggleTask(task._id, "done")
                                                    setActiveTask(null)
                                                }}
                                            >
                                                Mark as Done
                                            </button>

                                            <button
                                                className="bg-cyan-600 text-white px-4 py-2 rounded-full"
                                                onClick={() => {
                                                    toggleTask(task._id, "in-progress")
                                                    setActiveTask(null)
                                                }}
                                            >
                                                Mark as In-progress
                                            </button>

                                            <button
                                                className="bg-slate-400 text-white px-4 py-2 rounded-full"
                                                onClick={() => {
                                                    toggleTask(task._id, "under-review")
                                                    setActiveTask(null)
                                                }}
                                            >
                                                Mark as Under Review 
                                            </button>

                                            <button
                                                className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-full"
                                                onClick={() => {
                                                    deleteTask(task._id)
                                                    setActiveTask(null)
                                                }}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                className="border-2 border-gray-500 text-gray-500 px-4 py-2 rounded-full"
                                                onClick={() => {
                                                    setActiveTask(null)
                                                }}
                                            >
                                                Close
                                            </button>
                                            
                                        </div>
                                    </div>
                                )
                            }
                        </li>
                    )
                }
            </ul>
        </div>
    )

}