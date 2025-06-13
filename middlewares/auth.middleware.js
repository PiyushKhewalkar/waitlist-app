import jwt from "jsonwebtoken"

import { JWT_SECRET } from "../config/env.js"

import User from "../models/user.model.js"

const getUserFromToken = async (req, role = null) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new Error("Token not found");

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) throw new Error("Invalid token payload");

    const query = { _id: decoded.id };
    if (role) query.role = role;

    const user = await User.findOne(query);
    if (!user) throw new Error("User not found");

    return user;
};

const authorize = async (req, res, next) => {
    try {
        req.user = await getUserFromToken(req);
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

const adminAuthorize = async (req, res, next) => {
    try {
        req.user = await getUserFromToken(req, "admin");
        next();
    } catch (error) {
        console.error("Admin Authorization error:", error);
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

export { authorize, adminAuthorize };