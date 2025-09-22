import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, //permission to access cookies from frontend
  })
); //it means only this origin can access the resources

app.use(express.json({ limit: "16kb" })); //it means json data is allowed upto 16kb
app.use(express.urlencoded({ extended: true })); //it means to parse url encoded data

app.use(express.static("public")); //to serve static files like images ,css files ,js files
app.use(cookieParser()); //to parse cookies

// routes import

import userRouter from "./routes/user.routes.js";

// router declaration
app.use("/api/v1/users", userRouter);
export { app };
