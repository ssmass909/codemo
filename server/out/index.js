import express from "express";
import GuideRouter from "./routes/GuideRouter.js";
import "dotenv/config";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/UserRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
import cookieParser from "cookie-parser";
const app = express();
const port = 3000;
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
connectDB();
app.use("/guides", GuideRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.listen(port, () => {
    console.log(`express app is running on port ${port}`);
});
