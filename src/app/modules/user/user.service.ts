import { prisma } from "../../../lib/prisma";

const createUser = async (payload: any) => {
  const { name } = payload;
  const user = await prisma.user.create({
    data: payload,
  });

  return user;
};

export const UserService = {
  createUser,
};
