import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import type { CustomJwtSessionClaims } from "@repo/types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);
  const userId: string | undefined | null = auth.userId;
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ messsage: "You are not logged in" });
  }
  req.userId = userId;

  return next();
};

export const shouldBeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = getAuth(req);
  const userId: string | undefined | null = auth.userId;
  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (!userId) {
    return res.status(401).json({ messsage: "You are not logged in" });
  }

  if (claims.metadata?.role !== "admin") {
    return res.status(403).send({
      message: "Unauthorized Access",
    });
  }
  req.userId = userId;

  return next();
};
