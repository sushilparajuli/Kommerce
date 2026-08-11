import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { shouldbeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order";
import { consumer, producer } from "../utils/kafka.js";
const fastify = Fastify({
  logger: true,
});

fastify.register(clerkPlugin);

// Declare a route
fastify.get("/health", async function handler(request, reply) {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Declare a route
fastify.get(
  "/test",
  {
    preHandler: [shouldbeUser],
  },
  (request, reply) => {
    if (!request.userId) {
      return reply.code(401).send({
        message: "You are not logged in",
      });
    }

    return reply.status(200).send({
      message: "Order Service authenticated",
      userId: request.userId,
    });
  },
);

fastify.register(orderRoute);

// Run the server!
const start = async () => {
  try {
    Promise.all([
      await connectOrderDB(),
      await producer.connect(),
      await consumer.connect(),
    ]);
    await fastify.listen({ port: 8001 });
    console.log("Connected to MongoDB");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
