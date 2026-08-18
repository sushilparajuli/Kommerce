import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface AuthInfo {
  userId?: string | null;
  orgId?: string | null;
  claims?: Record<string, any>;
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth: AuthInfo = getAuth(req) as AuthInfo;
  const userId: string | undefined | null = auth.userId;
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ messsage: "You are not logged in" });
  }
  req.userId = userId;

  return next();
};
