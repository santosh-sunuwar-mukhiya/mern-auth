import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser';

import connectDB from "./config/db.js"
import router from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"

dotenv.config()
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:process.env.FRONTEND_URL, credentials: true }))

app.use('/api/auth', router);
app.use('/api/user', userRouter);

app.use("/", (req, res) => {
    res.send('Hello World From Express!')
})

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`The server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();