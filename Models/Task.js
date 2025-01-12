import mongoose from "mongoose";

const TaskScheme = mongoose.Schema({
     title: {
        type: String,
        required: true
     },
     description: {
        type: String,
        default: '10:00AM - 5:30PM'
     },
     status: {
        type: String,
        default: "Under-Review"
     }
})

export default mongoose.model.Task || mongoose.model("Task", TaskScheme)