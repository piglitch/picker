import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export default function verifyClerkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
      return;
    }

    (req as any).userId = userId;
    next();
  } catch (error) {
    console.error("Clerk Auth Middleware Error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
}
