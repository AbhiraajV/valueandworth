import AdminResolver from "./admin.resolver";
import HealthCheckResolver from "./healthcheck.resolver";
import TodoResolver from "./todo.resolver";
import UserResolver from "./user.resolver";

export const resolvers = [
  UserResolver,
  TodoResolver,
  HealthCheckResolver,
  AdminResolver,
] as const;
