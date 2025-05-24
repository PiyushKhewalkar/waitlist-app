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
    pages : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page"
    }],
    plan : {
        type: String,
        enum: ["free", "starter", "pro", "growth"],
        default: "free"
    }

},
{timestamps: true})

const User = mongoose.model("User", userSchema)

export default User