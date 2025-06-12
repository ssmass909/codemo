import { Request, Response, Router } from "express";
import { UserType } from "../types.js";
import { User, IUser } from "../schemas/UserSchema.js";
import { ExpressResponse } from "../utils/utilTypes.js";

const UserRouter = Router();

UserRouter.get("/:id", async (req: Request<{ id: string }>, res: Response<ExpressResponse<IUser>>) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("Provide user's id in request parameters!");
    const response = await User.findById(id);
    if (!response) throw new Error("User with that id couldn't be found!");
    res.json({ data: response });
  } catch (e) {
    res.json({ data: null, metadata: { error: e, resourceId: id } });
  }
});

UserRouter.post("/", async (req: Request<any, any, Omit<IUser, "id">>, res: Response<ExpressResponse<IUser>>) => {
  const user = req.body;
  console.log(user);

  try {
    const response = await User.create(user);
    res.json({ data: response });
  } catch (e) {
    res.json({ data: null, metadata: { error: e, requestBody: req.body } });
  }
});

UserRouter.put("/:id", async (req: Request<{ id: string }, any, UserType>, res: Response<ExpressResponse<IUser>>) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("Include user id in the request parameters!");
    const response = await User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
    res.json({ data: response });
  } catch (e) {
    res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: id } });
  }
});

UserRouter.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<ExpressResponse<{ acknowledged: boolean }>>) => {
    const { id } = req.params;

    try {
      if (!id) throw new Error("Include the id of the resource which you want to delete");
      const response = await User.deleteOne({ _id: id });
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

export default UserRouter;
