import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

const app = express();

//config .env file
dotenv.config();

//connect to mongoDB
connectDB();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => res.status(200).send("Hello World!"));

//port
app.listen(process.env.PORT);
