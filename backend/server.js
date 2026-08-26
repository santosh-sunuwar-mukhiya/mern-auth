import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser';

import connectDB from "./config/db.js"
import router from "./routes/auth.route.js"

dotenv.config()
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }))
app.use('/api/auth', router)

app.use('/', (req, res) => {
    res.send('Hello World From Express!')
})

app.listen(PORT, () => {
    connectDB();
    console.log(`The server is running on port: ${PORT}`)
    console.log('This is test for you.')
})