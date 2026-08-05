import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/health", async function handler(request, reply) {
  return reply.send({ hello: "world" });
});

// Run the server!
try {
  await fastify.listen({ port: 8001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
