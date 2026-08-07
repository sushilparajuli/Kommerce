import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

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
    const auth = getAuth(request);
    const userId = auth?.userId;

    if (!userId) {
      return reply.status(403).send({
        message: "You are not logged in",
      });
    }

    request.userId = userId;
  } catch {
    return reply.status(401).send({
      message: "You are not logged in from catch",
    });
  }
};

export const shouldbeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const auth = getAuth(request);
    const userId = auth?.userId;

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if (!userId) {
      return reply.status(401).send({
        message: "You are not logged in",
      });
    }

    if (claims.metadata?.role !== "admin") {
      return reply.status(403).send({
        message: "Unauthorized Access",
      });
    }
  } catch {
    return reply.status(401).send({
      message: "You are not logged in from catch",
    });
  }
};
