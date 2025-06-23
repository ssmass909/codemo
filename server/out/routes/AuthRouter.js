var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { User } from "../schemas/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const AuthRouter = Router();
// utility functions
const createAuthToken = (payload) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is not defined!");
    const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: 1000 * 60 * 15 });
    return authToken;
};
const createRefreshToken = (payload) => {
    const { JWT_REFRESH_SECRET } = process.env;
    if (!JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined!");
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET);
    return refreshToken;
};
const verifyAuthToken = (token) => {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is not defined!");
    return jwt.verify(token, JWT_SECRET);
};
const verifyRefreshToken = (token) => {
    const { JWT_REFRESH_SECRET } = process.env;
    if (!JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined!");
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        if (!token)
            throw new Error("Access token required");
        const decoded = verifyAuthToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ data: null, metadata: { error: "Access token expired" } });
        }
        else {
            res.status(401).json({
                data: null,
                message: error instanceof Error ? error.message : "Unknown error",
                metadata: { error: "Invalid access token" },
            });
        }
    }
};
//actual endpoints
AuthRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error("Email or password is missing!");
        const user = yield User.findOne({ email: email });
        if (!user)
            throw new Error("The credentials are incorrect!");
        const match = yield bcrypt.compare(password, user.password);
        if (!match)
            throw new Error("The credentials are incorrect!");
        const resultData = user.toObject();
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
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "error";
        res.status(401).json({ data: null, message: message, metadata: { error: e, requestBody: req.body } });
    }
}));
AuthRouter.post("/refresh", (req, res) => {
    const refreshToken = req.signedCookies.refreshToken;
    try {
        if (!refreshToken)
            throw new Error("Refresh token required");
        const decoded = verifyRefreshToken(refreshToken);
        const payload = decoded;
        const authToken = createAuthToken(payload);
        res.json({ data: { authToken } });
    }
    catch (e) {
        res.json({ data: null, message: e instanceof Error ? e.message : "unknown error", metadata: { error: e } });
    }
});
AuthRouter.post("/logout", (req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.json({ data: { message: "Logout successful" } });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e } });
    }
});
AuthRouter.get("/me", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = (yield User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("-password"));
        if (!user)
            throw new Error("User not found");
        res.json({ data: user });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "error";
        res.json({ data: null, message, metadata: { error: e, resourceId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } });
    }
}));
export default AuthRouter;
