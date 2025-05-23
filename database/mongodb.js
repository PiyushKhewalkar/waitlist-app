import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error(`Please define the DB_URI environment variable inside .env.${NODE_ENV}.local`);   
}

const connectToDatabase = async() => {
    try {

        await mongoose.connect(DB_URI)
        console.log(`Connected to the database in ${NODE_ENV} mode`)
        
    } catch (error) {
        console.error("Error connecting database", {error: error.message})
        process.exit(1)
    }
}

export default connectToDatabase