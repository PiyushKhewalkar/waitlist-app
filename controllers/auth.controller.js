import User from "../models/user.model.js";

import nodemailer from "nodemailer";
import { EMAIL_USERNAME, EMAIL_PASSWORD, JWT_SECRET, NODE_ENV } from "../config/env.js";

import emailVerification from "../utils/tokenSender.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(500)
      .json({ success: false, message: "details are missing" });

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(409)
        .json({ success: false, message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    emailVerification(user.email)

    return res
      .status(201)
      .json({ success: true, token, message: "User Registered succesfully", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(500)
      .json({ success: false, message: "Email and Password are required" });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user doesn't exist" });

    if (!user.isVerified) {
    await emailVerification(user.email)
      return res
        .status(403)
        .json({ message: "Please verify your email first, we have sent a verification link on your email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, token, message: "User Logged In succesfully", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV == "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "User logged out succesfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "User not found" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const resendEmailVerification = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email is required." });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ success: false, message: "Email already verified." });

    await emailVerification(email);

    return res.status(200).json({ success: true, message: "Verification email sent." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const sendResetOtp = async(req, res) => {
  try {

    const {email} = req.body

    if (!email) return res.status(500),json({message: "Email is required"})

    const user = await User.findOne({email})

    if (!user) return res.status(404).json({message: "User not found"})

    const otp = String(Math.floor(100000 + Math.random() * (90000)))

    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

    await user.save()

      const mailOption = {
        from: EMAIL_USERNAME,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Here's your OTP to reset password on Hypelister: ${otp}. Use this OTP to proceed with resetting your password. This OTP will expire in 15 minutes`
      }

      await transporter.sendMail(mailOption)

      return res.status(200).json({message: "Password Reset OTP has been sent to you succesfully"})
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

export const resetPassword = async(req, res) => {
  try {

    const {email, otp, newPassword} = req.body

    if (!email || !otp, !newPassword) return res.status(500).json({message: "Email, OTP and New password are required"})

    const user = await User.findOne({email})

    if (!user) return res.status(404).json({message: "User not found"})

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(500).json({message: "Invalid OTP"})
    }

    if (user.resetOtpExpireAt < Date.now()) return res.statur(500).json({message: "OTP is expired"})

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.resetOtp = ""
    user.resetOtpExpireAt = 0

    await user.save()

    return res.status(200).json({message: "Password has been reset succesfully"})
    
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}