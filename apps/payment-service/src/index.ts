import { serve } from "@hono/node-server";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();
app.use("*", clerkMiddleware());

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
app.get("/test", shouldBeUser, (c) => {
  return c.json({
    message: "You are logged in!",
    userId: c.get("userId"),
    status: 403,
  });
});

// app.post("/create-stripe-product", async (c) => {
//   const res = await stripe.products.create({
//     id: "123",
//     name: "test-product",
//     default_price_data: {
//       currency: "usd",
//       unit_amount: 10 * 100,
//     },
//   });

//   return c.json(res);
// });

// app.get("/stripe-product-price", async (c) => {
//   const res = await stripe.prices.list({
//     product: "123",
//   });

//   return c.json(res);
// });
const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(
          `Payment Service is running on http://localhost:${info.port}`,
        );
      },
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
