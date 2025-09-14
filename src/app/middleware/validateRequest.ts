import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
