import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI

let isConnected = false;

export const connectToDatabase = async () => {
    // If already connected, return early
    if(isConnected) return

    try {
        // Attempt to connect to the database

        const db = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // Check if connection is established
        isConnected = db.connection.readyState === 1;
        
        if (isConnected) {
            console.log("Connected to MongoDB");
        } else {
        console.log("Failed to connect to MongoDB");
        }
        
    } catch (error) {
        console.log("Unable to connect to db", error.message);
        
    }
}