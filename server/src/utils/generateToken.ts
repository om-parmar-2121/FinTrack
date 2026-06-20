import jwt from "jsonwebtoken";
import env from "../config/config.js";

const generateToken = (userId: any) => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET!,
    {
      expiresIn: env.JWT_EXPIRES as any,
    }
  );
};

export default generateToken;