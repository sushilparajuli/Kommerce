import Fastify from "fastify";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { shouldbeUser } from "./middleware/authMiddleware.js";
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
fastify.get("/test", { preHandler: shouldbeUser }, (request, reply) => {
  const { userId } = getAuth(request);

  if (!userId) {
    return reply.send({
      message: "You are not logged in",
    });
  }

  return reply.status(200).send({
    message: "Order Service authenticated",
    userId: request.userId,
  });
});

// Run the server!
try {
  await fastify.listen({ port: 8001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
