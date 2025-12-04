import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

export const isMinister = (req, res, next) => {
    if (req.userRole === "minister") {
        next();
        return;
    }
    res.status(403).send({ message: "Require Minister Role!" });
};
