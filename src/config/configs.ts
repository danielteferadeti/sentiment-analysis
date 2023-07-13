import dotenv from 'dotenv';
dotenv.config();

const  DB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skill_bridge"
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:'
const PORT = process.env.PORT || 3000

const configs = {
  DB_URI,
  SERVER_URL,
  PORT
}

export default configs

