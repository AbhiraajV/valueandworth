import { ApolloError } from "apollo-server";
import jwt from "jsonwebtoken";
const publicKey = Buffer.from(
  process.env.PUBLIC_KEY as string,
  "base64"
).toString("ascii");
const privateKey = Buffer.from(
  process.env.PRIVATE_KEY as string,
  "base64"
).toString("ascii");
// console.log({ privateKey, publicKey });
export const signJWT = (object: Object) =>
  jwt.sign(object, privateKey, {
    algorithm: "RS256",
  });

export function verifyJWT<T>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    throw new ApolloError(
      "Authentication failed, user must be logged in to perform this action"
    );
  }
}
