import { getModelForClass, Prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

type AdminRecordType = {
  User: { [k: string]: string };
  TaskAdded: { [k: string]: string };
}[];
@ObjectType()
export default class AdminSchema {
  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  email: string;

  @Field(() => String)
  @Prop({ required: true })
  todoTitle: string;

  @Field(() => String)
  @Prop({ required: true })
  tag: string;

  @Field(() => String)
  @Prop({ required: true })
  Deadline: string;
}
export const AdminModel = getModelForClass(AdminSchema);

@ObjectType()
export class CounterSchema {
  @Field(() => Number)
  @Prop({ default: 1 })
  pos: number;

  @Field(() => Number)
  @Prop({ required: false, default: 0 })
  total: number;

  @Field(() => Number)
  @Prop({ required: false, default: 0 })
  lastWeek: number;
}

export const CouterModel = getModelForClass(CounterSchema);
