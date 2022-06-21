import { ApolloError } from "apollo-server";
import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import AdminSchema, {
  AdminModel,
  CounterSchema,
  CouterModel,
} from "../schema/admin.schema";
import { CreateUserInput, LoginUserInput, User } from "../schema/user.schema";
import UserService, { UserInterceptor } from "../service/user.service";
import Context from "../types/context";
import GetUserFromCtx from "../utils/GetUserFromCtx";

@Resolver()
export default class AdminResolver {
  @Query(() => [AdminSchema])
  async getAdminReport(@Ctx() context: Context) {
    const curUser = await GetUserFromCtx(context);
    if (!curUser.isAdmin)
      throw new ApolloError("Only Admins have access to this data");
    const report = await AdminModel.find({})
      .then((data) => data)
      .catch((error) => console.log(error));
    console.log({ report });
    return report;
  }
  @Query(() => [CounterSchema])
  async getCount(@Ctx() context: Context) {
    const curUser = await GetUserFromCtx(context);
    if (!curUser.isAdmin)
      throw new ApolloError("Only Admins have access to this data");
    const report = await CouterModel.find({ pos: 1 })
      .then((data) => data)
      .catch((error) => console.log(error));
    console.log({ report });
    return report;
  }
}
