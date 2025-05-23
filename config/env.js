import {config} from "dotenv"

config({path : `.env.${process.env.NODE_ENV || 'development'}.local`})

export const {PORT, NODE_ENV, DB_URI, OPENAI_API_KEY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env