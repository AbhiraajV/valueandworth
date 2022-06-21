import { getModelForClass, pre, Prop, prop, Ref } from "@typegoose/typegoose";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import TodoSchema from "./todo.schema";

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash;
})
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => [TodoSchema])
  @Prop({ required: true, ref: () => TodoSchema, default: [] })
  todos: Ref<TodoSchema>[];

  @Field(() => Boolean)
  @Prop({ required: false, default: false })
  isAdmin: boolean;
}

export const UserModel = getModelForClass(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "password must be atleast 6 characters long",
  })
  @MaxLength(50, {
    message: "password must be atmax 50 characters long",
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginUserInput {
  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "password must be atleast 6 characters long",
  })
  @MaxLength(50, {
    message: "password must be atmax 50 characters long",
  })
  @Field(() => String)
  password: string;
}
