import type { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const UserController = {
  createUser,
};
