import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import e from "express";
import connectDB from "./db/connectDB.js";
import authRouter from "./routes/auth-route.js";
import uploadImageRouter from "./routes/image-route.js";
import authMiddleware from "./middlewares/auth-middleware.js";
config();

const PORT = process.env.PORT || 3000;

const app = e();

//middlewares
app.use(cors());
app.use(e.json());
app.use(cookieParser());

//routes

app.get("/", authMiddleware, (req, res) => {
  const user = req.user.username;
  res.status(200).json({
    success: true,
    message: `Welcome ${user}`,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/image", uploadImageRouter);

//server listen
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.info(`server listening on port ${PORT}...`);
  } catch (error) {
    console.error(error.message);
  }
});
