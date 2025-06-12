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
    const authToken = jwt.sign({ payload }, JWT_SECRET, { expiresIn: 1000 * 60 * 15 });
    return authToken;
};
const createRefreshToken = (payload) => {
    const { JWT_REFRESH_SECRET } = process.env;
    if (!JWT_REFRESH_SECRET)
        throw new Error("JWT_REFRESH_SECRET is not defined!");
    const refreshToken = jwt.sign({ payload }, JWT_REFRESH_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 30 });
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
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token)
        throw new Error("Access token required");
    try {
        const decoded = verifyAuthToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ data: null, metadata: { error: "Access token expired" } });
        }
        else {
            res.status(401).json({ data: null, metadata: { error: "Invalid access token" } });
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
        res.status(401).json({ data: null, metadata: { error: e, requestBody: req.body } });
    }
}));
AuthRouter.post("/refresh", (req, res) => {
    const refreshToken = req.signedCookies.refreshToken;
    try {
        if (!refreshToken)
            throw new Error("Refresh token required");
        const decoded = verifyRefreshToken(refreshToken);
        const payload = Object.assign({}, decoded);
        const newAccessToken = createAuthToken(payload);
        res.json({ data: { authToken: newAccessToken } });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e } });
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
    var _a;
    try {
        const user = (yield User.findById(req.user.userId).select("-password"));
        if (!user)
            throw new Error("User not found");
        res.json({ data: user });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, resourceId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId } });
    }
}));
AuthRouter.put("/profile", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, avatarUrl, location, website, bio } = req.body;
    try {
        const updatedUser = (yield User.findByIdAndUpdate(req.user.userId, {
            firstName,
            lastName,
            avatarUrl,
            location,
            website,
            bio,
        }, { new: true, runValidators: true }).select("-password"));
        if (!updatedUser)
            throw new Error("User not found");
        res.json({ data: updatedUser });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId } });
    }
}));
AuthRouter.put("/change-password", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = yield User.findById(req.user.userId);
        if (!user)
            throw new Error("User not found");
        const isValidPassword = yield bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword)
            throw new Error("Current password is incorrect");
        const saltRounds = 12;
        const hashedNewPassword = yield bcrypt.hash(newPassword, saltRounds);
        user.password = hashedNewPassword;
        yield user.save();
        res.clearCookie("refreshToken");
        res.json({ data: true, message: "Password changed successfully. Please log in again." });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId } });
    }
}));
export default AuthRouter;
