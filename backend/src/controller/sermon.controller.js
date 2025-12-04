import Sermon from "../model/Sermon.js";

export const createSermon = async (req, res) => {
    try {
        const sermon = new Sermon(req.body);
        await sermon.save();
        res.status(201).json(sermon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSermons = async (req, res) => {
    try {
        const sermons = await Sermon.find().sort({ date: -1 });
        res.status(200).json(sermons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sermon) return res.status(404).json({ message: "Sermon not found" });
        res.status(200).json(sermon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findByIdAndDelete(req.params.id);
        if (!sermon) return res.status(404).json({ message: "Sermon not found" });
        res.status(200).json({ message: "Sermon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
