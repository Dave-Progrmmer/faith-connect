import express from "express";
import { createPrayerRequest, getPrayerRequests, updatePrayerRequestStatus } from "../controller/prayerRequest.controller.js";
import { verifyToken, isMinister } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", [verifyToken], createPrayerRequest);
router.get("/", [verifyToken], getPrayerRequests);
router.put("/:id/status", [verifyToken, isMinister], updatePrayerRequestStatus);

export default router;
