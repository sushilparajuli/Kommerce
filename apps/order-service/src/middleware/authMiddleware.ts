import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    auth?: {
      userId?: string | null;
    };
  }
}

export const shouldbeUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const auth = request.auth ?? getAuth(request);
    const userId = auth?.userId;

    console.log(userId, "userId");

    if (!userId) {
      return reply.code(401).send({
        message: "You are not logged in",
      });
    }

    request.userId = userId;
  } catch {
    return reply.code(401).send({
      message: "You are not logged in from catch",
    });
  }
};
