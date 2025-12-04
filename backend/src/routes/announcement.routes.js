import express from "express";
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from "../controller/announcement.controller.js";
import { verifyToken, isMinister } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", [verifyToken, isMinister], createAnnouncement);
router.put("/:id", [verifyToken, isMinister], updateAnnouncement);
router.delete("/:id", [verifyToken, isMinister], deleteAnnouncement);

export default router;
