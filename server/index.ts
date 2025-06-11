import express from "express";
import GuidesRouter from "./routes/GuidesRouter.js";
import "dotenv/config";
import connectDB from "./utils/db.js";

const app = express();
app.use(express.json());
const port = 3000;

connectDB();

app.use("/guides", GuidesRouter);

app.listen(port, () => {
  console.log(`express app is running on port ${port}`);
});
