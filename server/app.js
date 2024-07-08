import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv"
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT|| 8800;

config();

// allowing the app to accept JSON content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// using cors for Cross origin resource sharing Policy

// app.use(cors({
//     origin: process.env.FRONTENED_URL,
//     credentials: true,
// }))

app.use(cookieParser());
// api endpoints
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/chat",chatRoute);
app.use("/api/v1/message",messageRoute);

app.listen(PORT,()=>console.log(`Server is runnug in the port ${PORT}`));