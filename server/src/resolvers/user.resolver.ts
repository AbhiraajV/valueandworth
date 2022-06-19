import {
  Arg,
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { CreateUserInput, LoginUserInput, User } from "../schema/user.schema";
import UserService, { UserInterceptor } from "../service/user.service";
import Context from "../types/context";
import GetUserFromCtx from "../utils/GetUserFromCtx";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  registerUser(@Arg("input") input: CreateUserInput) {
    console.log("USER");
    return this.userService.registerUser(input);
  }

  @Mutation(() => String)
  login(@Arg("input") input: LoginUserInput, @Ctx() context: Context) {
    return this.userService.loginUser(input, context);
  }

  @Query(() => User)
  @UseMiddleware(UserInterceptor)
  getUser(@Ctx() context: Context) {
    return GetUserFromCtx(context);
  }
}
