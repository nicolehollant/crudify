import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { CrudifyError } from "./utils";

export const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.EMAIL_SERVER_PASSWORD,
    user: process.env.EMAIL_SERVER_USER,
  },
  from: process.env.EMAIL_FROM,
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
});

export const generateAccessToken = (email: string) => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return jwt.sign({ email, expiration: date }, process.env.JWT_SECRET ?? "");
};
export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET ?? "");
};

export const isAuthenticatedInPool = (req: NextApiRequest) => {
  const { userID, userPoolName } = req.query;
  const auth = req.headers.authorization;
  if (!auth || !process.env.JWT_SECRET) {
    throw new CrudifyError("No auth header", 401);
  }
  const token = auth.replace("Bearer", "").trim();
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (
    !decoded?.hasOwnProperty("email") ||
    !decoded?.hasOwnProperty("expiration")
  ) {
    throw new CrudifyError("Invalid token", 403);
  }
  const { email, expiration } = decoded as {
    email: string;
    expiration: Date;
  };
  if (expiration < new Date()) {
    throw new CrudifyError("Token expired", 403);
  }
  return { userID, userPoolName, email };
};
