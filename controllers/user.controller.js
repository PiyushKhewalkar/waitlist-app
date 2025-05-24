import User from "../models/user.model.js";

export const getUsers = async(req, res) => {
    try {

        const users = await User.find()

        return res.status(200).json({ users });
        
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details : error.message });
    }
}

export const getUser = async(req, res) => {
    try {

        const {id} = req.params

        const user = await User.findById(id)

        if (!user) return res.status(404).jsno({message: "User Not Found"})

        return res.status(200).json({user})
        
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details : error.message });
    }
}