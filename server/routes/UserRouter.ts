import { Request, Response, Router } from "express";
import { User, IUser, UserType } from "../schemas/UserSchema.js";
import { ExpressResponse } from "../utils/utilTypes.js";
import { AuthenticatedRequest, authenticateToken } from "./AuthRouter.js";
import bcrypt from "bcrypt";

const UserRouter = Router();

UserRouter.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response<ExpressResponse<Omit<UserType, "password">>>) => {
    const { id } = req.params;

    try {
      if (!id) throw new Error("Provide user's id in request parameters!");
      const response = await User.findById(id);
      if (!response) throw new Error("User with that id couldn't be found!");
      const { password, ...publicResponse } = response;
      res.json({ data: publicResponse });
    } catch (e) {
      res.json({ data: null, metadata: { error: e, resourceId: id } });
    }
  }
);

UserRouter.post(
  "/",
  async (req: Request<any, any, Omit<UserType, "id">>, res: Response<ExpressResponse<Omit<UserType, "password">>>) => {
    const user = req.body;
    console.log(user);

    try {
      const exists = await User.findOne({ email: user.email });
      if (exists) throw new Error("User with that email already exists!");

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      const response = await User.create({ ...user, password: hashedPassword });
      const { password, ...responseObj } = response.toObject();

      res.json({ data: responseObj });
    } catch (e) {
      const metadata = { error: e instanceof Error ? e.message : e, requestBody: req.body };
      console.log(metadata);
      res.json({ data: null, metadata });
    }
  }
);

UserRouter.put(
  "/profile",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response<ExpressResponse<Omit<UserType, "password">>>): Promise<void> => {
    const { firstName, lastName, avatarUrl, location, website, bio } = req.body;

    try {
      const updatedUser = (await User.findByIdAndUpdate(
        req.user?._id,
        {
          firstName,
          lastName,
          avatarUrl,
          location,
          website,
          bio,
        },
        { new: true, runValidators: true }
      ).select("-password")) as Omit<IUser, "password">;

      if (!updatedUser) throw new Error("User not found");

      res.json({ data: updatedUser });
    } catch (e) {
      res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: req.user?._id } });
    }
  }
);

UserRouter.put(
  "/change-password",
  authenticateToken,
  async (
    req: AuthenticatedRequest<any, any, { currentPassword: string; newPassword: string }>,
    res: Response<ExpressResponse<any>>
  ): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user?._id);
      if (!user) throw new Error("User not found");
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) throw new Error("Current password is incorrect");

      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedNewPassword;
      await user.save();

      res.clearCookie("refreshToken");
      res.json({ data: true, message: "Password changed successfully. Please log in again." });
    } catch (e) {
      res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: req.user?._id } });
    }
  }
);

UserRouter.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest<{ id: string }>, res: Response<ExpressResponse<{ acknowledged: boolean }>>) => {
    const { id } = req.params;

    try {
      const user = await User.findById(req.user!._id);
      if (!user) throw new Error("User not found");
      if (!id) throw new Error("Include the id of the resource which you want to delete");
      if (user.id !== id) throw new Error("Who are you trying to delete?");

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
