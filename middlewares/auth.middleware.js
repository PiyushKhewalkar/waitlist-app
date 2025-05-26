import jwt from "jsonwebtoken"

import { JWT_SECRET } from "../config/env.js"

import User from "../models/user.model.js"

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            console.log("Token not found in headers");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        if (!decoded.id) {
            console.log("userId missing in token payload");
            return res.status(401).json({ message: "Invalid Token Payload" });
        }

        const user = await User.findById(decoded.id);
        console.log("User found:", user);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}

export default authorize