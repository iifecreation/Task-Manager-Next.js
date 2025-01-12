import { connectToDatabase } from "../../lib/db";
import Task from "../../Models/Task"

export default async  function handler (req, res) {
    try {
        await connectToDatabase
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
                const updatedTasks = await Task.findByIdAndUpdate(id, req.body, {new: true})
                res.status(200).json(updatedTasks)
                break
            case "DELETE":
                await Task.findByIdAndDelete(req.body)
                res.status(204).send()
                break
            default:
                res.status(205).send({message: "Method Not Allowed"})
        }
    } catch (error) {
        
    }
}