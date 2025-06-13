import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique: true,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password : {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
    verificationToken: {
        type: String
    },
    plan : {
        type: String,
        enum: ["free", "starter", "pro", "growth"],
        default: "free"
    },
    usage: {
        totalPages : {
            type: Number,
            default: 0
        },
        totalEmails: {
            type: Number,
            default: 0
        }
    }

},
{timestamps: true})

const User = mongoose.model("User", userSchema)

export default User