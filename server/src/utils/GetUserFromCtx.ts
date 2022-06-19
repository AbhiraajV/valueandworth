import { ApolloError } from "apollo-server";
import { User, UserModel } from "../schema/user.schema";
import Context from "../types/context";

export default async function (context: Context) {
  // console.log(context);
  const email = context.user?.email;
  if (!email) {
    throw new ApolloError("Login to continue");
  }
  const curUser = await UserModel.findOne({ email });
  if (!curUser) {
    throw new ApolloError("User must be logged in for this action");
  }
  return curUser;
}
