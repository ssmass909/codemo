import express from "express";
import GuideRouter from "./routes/GuideRouter.js";
import "dotenv/config";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/UserRouter.js";
const app = express();
app.use(express.json());
const port = 3000;
connectDB();
app.use("/guides", GuideRouter);
app.use("/users", UserRouter);
app.listen(port, () => {
    console.log(`express app is running on port ${port}`);
});
