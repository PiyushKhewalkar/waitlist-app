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
    subDomain: {
        type : String,
    },
    domain : {
        type : String
    },
    pageCode : {
        type : String
    }
},
{timestamps: true})

const Page = mongoose.model("Page", pageSchema)

export default Page