import express from "express";
import cors from "cors";
import { createApiRouter } from "../app/Http/Routes/api.js";

export function createApp({
  clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  catalog,
} = {}) {
  const app = express();

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());
  app.use("/api", createApiRouter({ catalog }));

  return app;
}
