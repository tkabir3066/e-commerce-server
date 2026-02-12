import { UserRole } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { envVars } from "../config/env";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = envVars.ADMIN;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Super admin credentials missing in env file");
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    console.log("Creating  admin...");

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    const admin = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {},
      create: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        role: UserRole.ADMIN,
        password: hashedPassword,
      },
    });

    console.log(" Admin created successfully");
    console.log(admin);
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};
