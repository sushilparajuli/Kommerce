import express, { NextFunction, Request, Response } from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import { consumer, producer } from "./utils/kafka.js";
const app = express();
app.use(
  cors({
    origin: ["htpp://localhost:3002", "htpp://localhost:3003"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
});

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  res.json({ message: "Product service authenticated", userId: req.userId });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Service Error!" });
});

const start = async () => {
  try {
    Promise.all([await producer.connect(), await consumer.connect()]);
    app.listen(8000, () => {
      console.log("Product Service is running on port 8000");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
