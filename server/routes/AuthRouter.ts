import { NextFunction, Request, Response, Router } from "express";
import { DefaultMetadata, ExpressResponse } from "../utils/utilTypes.js";
import { IUser, User, UserType } from "../schemas/UserSchema.js";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const AuthRouter = Router();

export interface AuthenticatedRequest<A = any, B = any, C = any, D = any, E extends Record<any, any> = any>
  extends Request<A, B, C, D, E> {
  user?: UserType;
}

// utility functions

const createAuthToken = (payload: Object) => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: 1000 * 60 * 15 });

  return authToken;
};

const createRefreshToken = (payload: Object) => {
  const { JWT_REFRESH_SECRET } = process.env;
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined!");
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET);
  return refreshToken;
};

const verifyAuthToken = (token: string) => {
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
  res: Response<ExpressResponse<any, DefaultMetadata>>,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token) throw new Error("Access token required");
    const decoded = verifyAuthToken(token) as UserType;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ data: null, metadata: { error: "Access token expired" } });
    } else {
      res.status(401).json({
        data: null,
        message: error instanceof Error ? error.message : "Unknown error",
        metadata: { error: "Invalid access token" },
      });
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
      const message = e instanceof Error ? e.message : "error";
      res.status(401).json({ data: null, message: message, metadata: { error: e, requestBody: req.body } });
    }
  }
);

AuthRouter.post("/refresh", (req: Request, res: Response<ExpressResponse<{ authToken: string }>>): void => {
  const refreshToken = req.signedCookies.refreshToken;

  try {
    if (!refreshToken) throw new Error("Refresh token required");
    const decoded = verifyRefreshToken(refreshToken);
    const payload = decoded;
    const authToken = createAuthToken(payload);
    res.json({ data: { authToken } });
  } catch (e) {
    res.json({ data: null, message: e instanceof Error ? e.message : "unknown error", metadata: { error: e } });
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
  async (req: AuthenticatedRequest, res: Response<ExpressResponse<Omit<UserType, "password">>>): Promise<void> => {
    try {
      const user = (await User.findById(req.user?._id).select("-password")) as Omit<IUser, "password">;
      if (!user) throw new Error("User not found");
      res.json({ data: user });
    } catch (e) {
      const message = e instanceof Error ? e.message : "error";
      res.json({ data: null, message, metadata: { error: e, resourceId: req.user?._id } });
    }
  }
);

export default AuthRouter;
