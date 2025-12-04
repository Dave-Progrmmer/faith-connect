import PrayerRequest from "../model/PrayerRequest.js";

export const createPrayerRequest = async (req, res) => {
    try {
        const prayerRequest = new PrayerRequest({
            ...req.body,
            user: req.userId
        });
        await prayerRequest.save();
        res.status(201).json(prayerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPrayerRequests = async (req, res) => {
    try {
        // Ministers see all, Members see only their own
        let query = {};
        if (req.userRole !== "minister") {
            query = { user: req.userId };
        }
        
        const prayerRequests = await PrayerRequest.find(query).populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(prayerRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePrayerRequestStatus = async (req, res) => {
    try {
        const prayerRequest = await PrayerRequest.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        if (!prayerRequest) return res.status(404).json({ message: "Prayer Request not found" });
        res.status(200).json(prayerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
