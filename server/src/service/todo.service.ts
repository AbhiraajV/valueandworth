import { ApolloError } from "apollo-server";
import { isValidObjectId } from "mongoose";
import { Arg, Ctx } from "type-graphql";
import { AdminModel } from "../schema/admin.schema";
import TodoSchema, {
  createTaskInput,
  InvertTodoStatusInput,
  TodoModel,
} from "../schema/todo.schema";
import { User } from "../schema/user.schema";
import Context from "../types/context";
import GetUserFromCtx from "../utils/GetUserFromCtx";
import { CouterModel } from "../schema/admin.schema";
const testDate = (dateToTest: string) => {
  const dateAr = dateToTest.split("-");
  dateToTest = dateAr[1] + "/" + dateAr[0] + "/" + dateAr[2];
  console.log(dateToTest);
  return /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/.test(
    dateToTest
  );
};
export default class TodoService {
  async adminRecordService(user: User, createdTodo: TodoSchema) {
    await AdminModel.create({
      name: user.name,
      email: user.email,
      todoTitle: createdTodo.todoTitle,
      tag: createdTodo.tag,
      Deadline: createdTodo.Deadline,
    });
  }
  async incrementCount() {
    var curCounter = await CouterModel.findOne({ pos: 1 });
    if (!curCounter) curCounter = await CouterModel.create({ pos: 1 });
    curCounter.total += 1;
    await curCounter.save();
  }
  async createTodoService(
    @Arg("input") input: createTaskInput,
    @Ctx() context: Context
  ) {
    const { todoTitle, tag, Deadline } = input;

    if (tag !== "Personal" && tag !== "Home" && tag !== "Office")
      throw new ApolloError("Tag must be included");
    if (todoTitle.trim() === "")
      throw new ApolloError("Tasks cannot have blank titles");

    if (!testDate(Deadline)) throw new ApolloError("Deadline must be given");
    const user = await GetUserFromCtx(context);
    const createdTodo = await TodoModel.create(input);

    user.todos.push(createdTodo);
    await user.save();
    console.log({ createdTodo });
    await this.adminRecordService(user, createdTodo);
    await this.incrementCount();
    return createdTodo;
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
