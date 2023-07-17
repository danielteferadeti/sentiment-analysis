import express, {
  Application,
  Request,
  Response,
  NextFunction
} from 'express'

import { BaseResponse } from './types/baseResponse';
import routes from "./routes";
import errorHandler from "./middlewares/ErrorHandler";
import cookieParser from "cookie-parser";
import expressupload from "express-fileupload";
import cors from "cors";

const app: Application = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(expressupload());
app.use(cors());

app.use("/api/v1/userContact", routes.userRouter);
app.use("/api/v1/chat", routes.chatRouter);

app.get("/", (req, res) => {
  let baseResponse = new BaseResponse();
  baseResponse.success = true
  baseResponse.message = "Welcome to Skill Bridge Web Page!"
  baseResponse.data = {
    welcome: "Welcome to Skill Bridge Web Page!"
  }
  return res.status(200).json({ ...baseResponse });
});

// Error handling 
app.use(errorHandler);

export const config = {
  api: {
    timeout: 30
  }
};

export default app;

