import { getModelForClass, Prop, Ref } from "@typegoose/typegoose";
import { ArrayMinSize, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export default class TodoSchema {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  todoTitle: string;

  //   @Field(() => String)
  //   @Prop({ required: true })
  //   _id: string;

  @Field(() => Boolean)
  @Prop({ required: true, default: false })
  isCompleted: boolean;

  @Field(() => Date)
  @Prop({ required: true, default: Date.now() })
  Deadline: Date;
}
export const TodoModel = getModelForClass(TodoSchema);
@InputType()
export class createTaskInput {
  @MinLength(1, {
    message: "Minimum length of a task title must be 1 character",
  })
  @Field(() => String)
  @Prop({ required: true })
  todoTitle: string;

  //   @Field(() => Date)
  //   @Prop({ required: false })
  //   Deadline: Date;
}
@InputType()
export class InvertTodoStatusInput {
  @Field(() => String)
  @Prop({ required: true })
  todoId: string;
}
