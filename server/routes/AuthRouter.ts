import { NextFunction, Request, Response, Router } from "express";
import { ExpressResponse } from "../utils/utilTypes.js";
import { IUser, User } from "../schemas/UserSchema.js";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const AuthRouter = Router();

interface AuthenticatedRequest<A = any, B = any, C = any, D = any, E extends Record<any, any> = any>
  extends Request<A, B, C, D, E> {
  user?: JwtPayload;
}

// utility functions

const createAuthToken = (payload: any) => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  const authToken = jwt.sign({ payload }, JWT_SECRET, { expiresIn: 1000 * 60 * 15 });
  return authToken;
};

const createRefreshToken = (payload: any) => {
  const { JWT_REFRESH_SECRET } = process.env;
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined!");
  const refreshToken = jwt.sign({ payload }, JWT_REFRESH_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 30 });
  return refreshToken;
};

const verifyAuthToken = (token: string): JwtPayload => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

const verifyRefreshToken = (token: string): JwtPayload => {
  const { JWT_REFRESH_SECRET } = process.env;
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined!");
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response<ExpressResponse<any>>,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) throw new Error("Access token required");

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ data: null, metadata: { error: "Access token expired" } });
    } else {
      res.status(401).json({ data: null, metadata: { error: "Invalid access token" } });
    }
  }
};

//actual endpoints

AuthRouter.post(
  "/login",
  async (req: Request<any, any, { email: string; password: string }>, res: Response<ExpressResponse<any>>) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new Error("Email or password is missing!");
      const user = await User.findOne({ email: email });
      if (!user) throw new Error("The credentials are incorrect!");
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("The credentials are incorrect!");

      const resultData: Partial<IUser> = user.toObject();
      delete resultData.password;

      const authToken = createAuthToken(resultData);
      const refreshToken = createRefreshToken(resultData);

      res
        .cookie("refreshToken", refreshToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          signed: true,
        })
        .json({ data: { authToken } });
    } catch (e) {
      res.status(401).json({ data: null, metadata: { error: e, requestBody: req.body } });
    }
  }
);

AuthRouter.post("/refresh", (req: Request, res: Response<ExpressResponse<{ authToken: string }>>): void => {
  const refreshToken = req.signedCookies.refreshToken;

  try {
    if (!refreshToken) throw new Error("Refresh token required");
    const decoded = verifyRefreshToken(refreshToken);
    const payload: JwtPayload = { ...decoded };
    const newAccessToken = createAuthToken(payload);

    res.json({ data: { authToken: newAccessToken } });
  } catch (e) {
    res.json({ data: null, metadata: { error: e } });
  }
});

AuthRouter.post("/logout", (req: Request, res: Response<ExpressResponse<{ message: string }>>): void => {
  try {
    res.clearCookie("refreshToken");
    res.json({ data: { message: "Logout successful" } });
  } catch (e) {
    res.json({ data: null, metadata: { error: e } });
  }
});

AuthRouter.get(
  "/me",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response<ExpressResponse<Omit<IUser, "password">>>): Promise<void> => {
    try {
      const user = (await User.findById(req.user!.userId).select("-password")) as Omit<IUser, "password">;
      if (!user) throw new Error("User not found");

      res.json({ data: user });
    } catch (e) {
      res.json({ data: null, metadata: { error: e, resourceId: req.user?.userId } });
    }
  }
);

AuthRouter.put(
  "/profile",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response<ExpressResponse<Omit<IUser, "password">>>): Promise<void> => {
    const { firstName, lastName, avatarUrl, location, website, bio } = req.body;

    try {
      const updatedUser = (await User.findByIdAndUpdate(
        req.user!.userId,
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
      res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: req.user?.userId } });
    }
  }
);

AuthRouter.put(
  "/change-password",
  authenticateToken,
  async (
    req: AuthenticatedRequest<any, any, { currentPassword: string; newPassword: string }>,
    res: Response<ExpressResponse<any>>
  ): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await User.findById(req.user!.userId);
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
      res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: req.user?.userId } });
    }
  }
);

export default AuthRouter;
