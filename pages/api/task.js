import { connectToDatabase } from "../../lib/db";
import Task from "../../Models/Task"

export default async  function handler (req, res) {
    try {
        // Ensure the database is connected before any operation
        await connectToDatabase() 
        const {method} = req
        const {id} = req.query

        switch(method){
            case "GET":
                const tasks = await Task.find({})
                res.status(200).json(tasks)
                break
            case "POST":
                const newTasks = await Task.create(req.body)
                res.status(201).json(newTasks)
                break
            case "PUT":
                const updatedTask = await Task.findByIdAndUpdate(id, req.body, {new: true})
                if (!updatedTask) {
                    res.status(404).json({ message: "Task not found" });
                  } else {
                    res.status(200).json(updatedTask);
                  }
                break
            case "DELETE":
                const deletedTask = await Task.findByIdAndDelete(id);

                if (!deletedTask) {
                res.status(404).json({ message: "Task not found" });
                } else {
                res.status(204).send();  // No content
                }
                
                break
            default:
                res.status(405).send({message: "Method Not Allowed"})
        }
    } catch (error) {
        console.error(error);  // Log the error to the console for debugging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}