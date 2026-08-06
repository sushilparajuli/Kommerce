import express, { Request, Response } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import cors from "cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
const app = express();
app.use(
  cors({
    origin: ["htpp://localhost:3002", "htpp://localhost:3003"],
    credentials: true,
  }),
);

app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({ message: "Product service authenticated", userId: req.userId });
});

app.listen(8000, () => {
  console.log("Product Service is running on port 8000");
});
