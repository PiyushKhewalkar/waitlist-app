import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    templateNumber : {
        type : Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    templateCode: {
        type: String,
    },
    responseFormat : {
        type: String,
    }
},

{timestamps: true}
)

const Template = mongoose.model("Template", templateSchema)

export default Template