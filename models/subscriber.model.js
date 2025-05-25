import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    name : {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Page",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{timestamps: true})

const Subscriber = mongoose.model("Subscriber", subscriberSchema)

export default Subscriber