import { ApolloError } from "apollo-server";
import { isValidObjectId } from "mongoose";
import { Arg, Ctx } from "type-graphql";
import {
  createTaskInput,
  InvertTodoStatusInput,
  TodoModel,
} from "../schema/todo.schema";
import Context from "../types/context";
import GetUserFromCtx from "../utils/GetUserFromCtx";

export default class TodoService {
  async createTodoService(
    @Arg("input") input: createTaskInput,
    @Ctx() context: Context
  ) {
    try {
      const { todoTitle } = input;

      if (todoTitle.trim() === "") {
        throw new ApolloError("Tasks cannot have blank titles");
      }
      const user = await GetUserFromCtx(context);
      const createdTodo = await TodoModel.create(input);

      user.todos.push(createdTodo);
      await user.save();
      console.log({ createdTodo });
      return createdTodo;
    } catch (e: any) {
      throw new ApolloError("Something went wrong ", e);
    }
  }
  async invertTodoStatusService(
    @Arg("input") input: InvertTodoStatusInput,
    @Ctx() context: Context
  ) {
    try {
      const { todoId } = input;
      if (todoId.trim() === "" || !isValidObjectId(todoId)) {
        throw new ApolloError("Invalid ID");
      }
      const user = await GetUserFromCtx(context);

      const todos = user.todos;
      var userHasTodo = false;
      for (var i in todos) if (todos[i] == todoId) userHasTodo = true;

      if (!userHasTodo) throw new ApolloError("The user cannot edit this todo");

      const todo = await TodoModel.findById(todoId);
      if (!todo) throw new ApolloError("No such todo exists");

      todo.isCompleted = !todo.isCompleted;
      todo.save();
      return todo;
    } catch (error: any) {
      throw new ApolloError("Something went wrong ", error);
    }
  }
}
