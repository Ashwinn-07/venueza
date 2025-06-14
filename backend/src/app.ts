import express from "express";
import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middlewares/logger.middleware";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;
