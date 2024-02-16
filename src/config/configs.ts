import dotenv from 'dotenv';
dotenv.config();

const  DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sentiment_analysis"
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:'
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'tempSeceret' 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const AUTH_TOKEN_EXP_DAY = Number(process.env.AUTH_TOKEN_EXP_DAY) || 30

const configs = {
  DB_URI,
  SERVER_URL,
  PORT,
  JWT_SECRET,
  OPENAI_API_KEY,
  AUTH_TOKEN_EXP_DAY
}

export default configs

