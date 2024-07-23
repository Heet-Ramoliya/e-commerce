import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

const app = express();

//config .env file
dotenv.config();

//connect to mongoDB
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.get('/', (req, res) => res.status(200).send('Hello World!'));

//port
app.listen(process.env.PORT);