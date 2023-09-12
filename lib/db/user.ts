import prisma from "./prisma";

// get all users from user schema
export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: { email },
  });
};
