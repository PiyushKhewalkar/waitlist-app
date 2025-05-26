import User from "../models/user.model.js";

import { JWT_SECRET, NODE_ENV } from "../config/env.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res) => {
    const {email, password} = req.body

    if (!email || !password) return res.status(500).json({success:false, message: "details are missing"})

    try {
        const existingUser = await User.findOne({email})

        if (existingUser) return res.status(500).json({success: false, message: "User Already Exists"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            email,
            password: hashedPassword
        })

        await user.save()

        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV == 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({success: true, token, message: "User Registered succesfully"})
        
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body

    if (!email || !password) return res.status(500).json({success:false, message: "Email and Password are required"})

        try {

            const user = await User.findOne({email})

            if (!user) return res.status(404).json({success: false, message: "user doesn't exist"})

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) return res.status(500).json({success: false, message: "invalid password"})

                const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '7d'})

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: NODE_ENV === "production",
                    sameSite: NODE_ENV == 'production' ? 'none' : 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })

            return res.status(200).json({success: true, token, message: "User Logged In succesfully"})
            
        } catch (error) {
            res.status(500).json({success: false, error: error.message})
        }
}

export const logout = async(req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true, 
            secure: NODE_ENV === 'production',
            sameSite: NODE_ENV == 'production' ? 'none' : 'strict'
        })

        return res.status(200).json({success:true, message: "User logged out succesfully!"})
        
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }
}