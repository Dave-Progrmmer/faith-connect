import express from "express";
import { createSermon, getSermons, updateSermon, deleteSermon } from "../controller/sermon.controller.js";
import { verifyToken, isMinister } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getSermons);
router.post("/", [verifyToken, isMinister], createSermon);
router.put("/:id", [verifyToken, isMinister], updateSermon);
router.delete("/:id", [verifyToken, isMinister], deleteSermon);

export default router;
