// utils/tokenSender.js

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { EMAIL_USERNAME, EMAIL_PASSWORD, JWT_SECRET } from "../config/env.js";

export default async function emailVerification(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10m" });

  const mailOptions = {
    from: EMAIL_USERNAME,
    to: email,
    subject: "Verify your email - Hypelister",
    text: `Hi there, please verify your email by clicking the link:
https://hypelister.com/verify/${token}

This link will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}
