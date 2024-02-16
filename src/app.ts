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
import cors from "cors";

const app: Application = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", routes.userRouter);

app.use("/api/v1/review", routes.reviewRouter);


app.get("/", (req, res) => {
  let baseResponse = new BaseResponse();
  baseResponse.success = true
  baseResponse.message = "Welcome to sentiment analysis backend app!"
  baseResponse.data = {
    welcome: "Welcome to sentiment analysis backend app!"
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

