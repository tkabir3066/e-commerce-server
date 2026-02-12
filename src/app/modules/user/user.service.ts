import { StatusCodes } from "http-status-codes";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../errorHelper/ApiError";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: any) => {
  const { name, email, password } = payload;

  if (!name || !email || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Please provide all required fields.",
    );
  }
  if (password.length < 8 || password.length > 16) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password must be between 8 and 16 characters.",
    );
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "User already exist with this email.",
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  return user;
};

export const UserService = {
  createUser,
};
