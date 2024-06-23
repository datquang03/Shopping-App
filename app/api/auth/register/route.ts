import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import UserModels from "@/lib/models/UserModels";

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new UserModels({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return Response.json(
      { message: "User has been created" },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
};
