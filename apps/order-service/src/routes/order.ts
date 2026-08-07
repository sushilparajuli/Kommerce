import { FastifyInstance } from "fastify";
import { shouldbeAdmin, shouldbeUser } from "../middleware/authMiddleware";

import { Order } from "@repo/order-db";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: [shouldbeUser] },
    async (request, reply) => {
      console.log("userId", request);
      const orders = await Order.find({ userId: request.userId });
      return reply.send(orders);
    },
  );

  fastify.get(
    "/orders",
    { preHandler: [shouldbeAdmin] },
    async (request, reply) => {
      const orders = await Order.find();
      return reply.send(orders);
    },
  );
};
