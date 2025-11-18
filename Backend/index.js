import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json()); //middleware
app.use(cookieParser());
app.use('/api/v1/auth', authRouter) 
app.use('/api/v1/user', userRouter);


app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});


