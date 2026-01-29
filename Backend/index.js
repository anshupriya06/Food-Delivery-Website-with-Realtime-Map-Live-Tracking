import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); //middleware
app.use(cookieParser());
app.use('/api/v1/auth', authRouter) 
app.use('/api/v1/user', userRouter);
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/item', itemRouter);
app.use('/api/item', itemRouter); 



app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});


