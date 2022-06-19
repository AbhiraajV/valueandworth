import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import TodoSchema, {
  createTaskInput,
  InvertTodoStatusInput,
} from "../schema/todo.schema";
import TodoService from "../service/todo.service";
import Context from "../types/context";

@Resolver()
export default class TodoResolver {
  constructor(private taskServices: TodoService) {
    this.taskServices = new TodoService();
  }
  @Mutation(() => TodoSchema)
  async createTaskResolver(
    @Arg("input") input: createTaskInput,
    @Ctx() context: Context
  ) {
    return await this.taskServices.createTodoService(input, context);
  }

  @Mutation(() => TodoSchema)
  async invertTodoStatusResolver(
    @Arg("input") input: InvertTodoStatusInput,
    @Ctx() context: Context
  ) {
    return await this.taskServices.invertTodoStatusService(input, context);
  }
}
