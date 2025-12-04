import express from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controller/event.controller.js";
import { verifyToken, isMinister } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", [verifyToken, isMinister], createEvent);
router.put("/:id", [verifyToken, isMinister], updateEvent);
router.delete("/:id", [verifyToken, isMinister], deleteEvent);

export default router;
