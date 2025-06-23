var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Router } from "express";
import { User } from "../schemas/UserSchema.js";
import { authenticateToken } from "./AuthRouter.js";
import bcrypt from "bcrypt";
const UserRouter = Router();
UserRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new Error("Provide user's id in request parameters!");
        const response = yield User.findById(id);
        if (!response)
            throw new Error("User with that id couldn't be found!");
        const { password } = response, publicResponse = __rest(response, ["password"]);
        res.json({ data: publicResponse });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, resourceId: id } });
    }
}));
UserRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    console.log(user);
    try {
        const exists = yield User.findOne({ email: user.email });
        if (exists)
            throw new Error("User with that email already exists!");
        const saltRounds = 10;
        const hashedPassword = yield bcrypt.hash(user.password, saltRounds);
        const response = yield User.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
        const _a = response.toObject(), { password } = _a, responseObj = __rest(_a, ["password"]);
        res.json({ data: responseObj });
    }
    catch (e) {
        const metadata = { error: e instanceof Error ? e.message : e, requestBody: req.body };
        console.log(metadata);
        res.json({ data: null, metadata });
    }
}));
UserRouter.put("/profile", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { firstName, lastName, avatarUrl, location, website, bio } = req.body;
    try {
        const updatedUser = (yield User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
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
        res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } });
    }
}));
UserRouter.put("/change-password", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { currentPassword, newPassword } = req.body;
    try {
        const user = yield User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
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
        res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id } });
    }
}));
UserRouter.delete("/:id", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User.findById(req.user._id);
        if (!user)
            throw new Error("User not found");
        if (!id)
            throw new Error("Include the id of the resource which you want to delete");
        if (user.id !== id)
            throw new Error("Who are you trying to delete?");
        const response = yield User.deleteOne({ _id: id });
        res.json({ data: { acknowledged: response.acknowledged } });
    }
    catch (e) {
        res.json({
            data: null,
            metadata: {
                error: e,
                resourceId: id,
                requestBody: req.body,
            },
        });
    }
}));
export default UserRouter;
