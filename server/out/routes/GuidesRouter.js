import { Router } from "express";
const GuidesRouter = Router();
GuidesRouter.get("/", (req, res) => {
    console.log("test");
});
export default GuidesRouter;
