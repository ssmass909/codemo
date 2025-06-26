import { Request, Response, Router } from "express";
import { Guide, GuideType } from "../schemas/GuideSchema.js";
import { ExpressResponse } from "../utils/utilTypes.js";

const GuideRouter = Router();

GuideRouter.get("/:id", async (req: Request<{ id: string }>, res: Response<ExpressResponse<GuideType>>) => {
  const { id } = req.params;
  const response = await Guide.findById(id);

  if (!response) {
    res.json({ data: null, message: "Guide with that id couldn't be found." });
    return;
  }

  res.json({ data: response });
});

GuideRouter.get("/user/:id", async (req: Request<{ id: string }>, res: Response<ExpressResponse<GuideType[]>>) => {
  const { id } = req.params;
  try {
    const response = await Guide.find({ owner: id });
    if (!response) throw new Error("Couldn't get guides!");
    res.json({ data: response });
  } catch (e) {
    res.json({
      data: null,
      message: e instanceof Error ? e.message : undefined,
      metadata: { error: e, resourceId: id },
    });
  }
});

GuideRouter.post(
  "/",
  async (req: Request<any, any, Omit<GuideType, "id">>, res: Response<ExpressResponse<GuideType>>) => {
    const guide = req.body;
    console.log(req.body);
    const response = await Guide.create(guide);
    res.json({ data: response });
  }
);

GuideRouter.put(
  "/:id",
  async (req: Request<{ id: string }, any, GuideType>, res: Response<ExpressResponse<GuideType>>) => {
    const { id } = req.params;
    if (!id) {
      res.json({ data: null, message: "Include the id of the resource which you want to modify" });
    }

    try {
      const response = await Guide.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
      res.json({ data: response });
    } catch (e) {
      res.json({
        data: null,
        metadata: {
          error: e,
          resourceId: id,
          requestBody: req.body,
        },
      });
    }
  }
);

GuideRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<ExpressResponse<{ acknowledged: boolean }>>) => {
    const { id } = req.params;

    try {
      if (!id) throw new Error("Include the id of the resource which you want to delete");
      const response = await Guide.deleteOne({ _id: id });
      res.json({ data: { acknowledged: response.acknowledged } });
    } catch (e) {
      res.json({
        data: null,
        metadata: {
          error: e,
          resourceId: id,
          requestBody: req.body,
        },
      });
    }
  }
);

export default GuideRouter;
