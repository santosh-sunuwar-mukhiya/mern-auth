import mongoose from 'mongoose'
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host} ${conn.connection.port}`)
    } catch (error) {
        console.log(`Error Occured during connection: ${error}`)
    }
}

export default connectDB;