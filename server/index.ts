import express from "express";
import GuideRouter from "./routes/GuideRouter.js";
import "dotenv/config";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/UserRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";

const app = express();
const port = 3000;

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (process.env.CLIENT_URL) {
      // Support wildcard at the end, e.g. https://example.com*
      const base = process.env.CLIENT_URL.replace(/\*+$/, "");
      if (origin && origin.startsWith(base)) {
        return callback(null, true);
      }
    }
    if (origin === "http://localhost:5173") {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

connectDB();

app.use("/guides", GuideRouter);
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);

app.listen(port, () => {
  console.log(`express app is running on port ${port}`);
});
