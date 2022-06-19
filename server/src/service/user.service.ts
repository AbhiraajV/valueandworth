import { ApolloError } from "apollo-server";
import bcrypt from "bcrypt";
import { MiddlewareFn } from "type-graphql";
import { TodoModel } from "../schema/todo.schema";
import {
  CreateUserInput,
  LoginUserInput,
  User,
  UserModel,
} from "../schema/user.schema";
import Context from "../types/context";
import { signJWT } from "../utils/JWT";

export default class UserService {
  async registerUser(input: CreateUserInput) {
    console.log({ input });
    const isUser = await findByEmail(input.email);
    if (isUser) throw new ApolloError("User with this Email id already exists");
    return UserModel.create(input);
  }

  async loginUser(input: LoginUserInput, context: Context) {
    const e = "Invalid Email or Password";
    const user = await findByEmail(input.email);

    if (!user) throw new ApolloError(e);

    const isPasswordValid = bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) throw new ApolloError(e);
    console.log(user);
    const token = signJWT(JSON.stringify(user));
    return token;
  }
}

export const UserInterceptor: MiddlewareFn<any> = async ({ info }, next) => {
  const user = await next();
  console.log({ user });
  if (user === undefined) return;

  var todos = user.todos;
  var populatedTodos = [];
  if (todos.length !== 0) {
    for (var i in todos) {
      let todo = await TodoModel.findById(todos[i]);
      console.log(todo);
      populatedTodos.push(todo);
    }
  }
  user.todos = populatedTodos;
  return user;
};

const findByEmail = async (input: User["email"]) =>
  await UserModel.findOne({ email: input });
