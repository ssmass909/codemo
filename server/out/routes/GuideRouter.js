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
import { Guide } from "../schemas/GuideSchema.js";
const GuideRouter = Router();
GuideRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const response = yield Guide.findById(id);
    if (!response) {
        res.json({ data: null, message: "Guide with that id couldn't be found." });
        return;
    }
    res.json({ data: response });
}));
GuideRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guide = req.body;
    console.log(req.body);
    const response = yield Guide.create(guide);
    res.json({ data: response });
}));
GuideRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.json({ data: null, message: "Include the id of the resource which you want to modify" });
    }
    try {
        const response = yield Guide.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        res.json({ data: response });
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
GuideRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new Error("Include the id of the resource which you want to delete");
        const response = yield Guide.deleteOne({ _id: id });
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
export default GuideRouter;
