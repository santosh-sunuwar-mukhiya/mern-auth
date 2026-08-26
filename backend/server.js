import express from "express"
import connectDB from "./config/db.js"
import dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())

app.use('/', (req, res) => {
    res.send('Hello World From Express!')
})

app.listen(PORT, () => {
    connectDB();
    console.log(`The server is running on port: ${PORT}`)
    console.log('This is test for you.')
})