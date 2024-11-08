import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { User } from "../shared";

export const getUser = async (token: string) => {
  if (!token) {
    return { message: "No token provided", status: 401 };
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return { message: "User not found", status: 404 };
    }
    return { user, status: 200 };
  } catch (error) {
    return { message: "Invalid token", status: 500 };
  }
};

export const authMiddleware = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  const response = await getUser(token);
  if (response.status !== 200) {
    res.status(response.status).json({ message: response.message });
  }
  req.user = response.user;
};
