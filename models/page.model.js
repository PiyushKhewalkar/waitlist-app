// page name
// page link (if published)
// page code

import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    name: {
        type : String
    },
    pageLink: {
        type: String
    },
    thumbnail : {
        type: String
    },
    pathName: {
        type : String,
    },
    domain : {
        type : String
    },
    pageCode : {
        type : String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscribers: {
        type: Number,
        default: 0,
        required: true
    }
},
{timestamps: true})

const Page = mongoose.model("Page", pageSchema)

export default Page