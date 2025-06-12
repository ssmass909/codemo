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
const UserRouter = Router();
UserRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new Error("Provide user's id in request parameters!");
        const response = yield User.findById(id);
        if (!response)
            throw new Error("User with that id couldn't be found!");
        res.json({ data: response });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, resourceId: id } });
    }
}));
UserRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    console.log(user);
    try {
        const response = yield User.create(user);
        res.json({ data: response });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, requestBody: req.body } });
    }
}));
UserRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new Error("Include user id in the request parameters!");
        const response = yield User.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        res.json({ data: response });
    }
    catch (e) {
        res.json({ data: null, metadata: { error: e, requestBody: req.body, resourceId: id } });
    }
}));
UserRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new Error("Include the id of the resource which you want to delete");
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
