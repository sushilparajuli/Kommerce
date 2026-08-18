import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: ["htpp://localhost:3002", "htpp://localhost:3003"],
    credentials: true,
  }),
);

app.listen(8000, () => {
  console.log("Product Service is running on port 8000");
});
