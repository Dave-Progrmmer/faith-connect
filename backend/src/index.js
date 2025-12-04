import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sermonRoutes from "./routes/sermon.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import prayerRequestRoutes from "./routes/prayerRequest.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to DB before handling any request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/prayer-requests", prayerRequestRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;