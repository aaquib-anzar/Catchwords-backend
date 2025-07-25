import mongoose from "mongoose";

export const db_connect = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error connection to MongoDB : ${error.message}`)
        process.exit(1)
    }
}