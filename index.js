import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import connectDB from "./db/connectDB.js";
import authRouter from "./routes/auth-route.js";
config();

const PORT = process.env.PORT || 3000;

const app = e();

//middlewares
app.use(cors());
app.use(e.json());
app.use(cookieParser());

//routes

app.use("/api/auth", authRouter);

//server listen
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.info(`server listening on port ${PORT}...`);
  } catch (error) {
    console.error(error.message);
  }
});
