import { Query, Resolver } from "type-graphql";
@Resolver()
export default class HealthCheckResolver {
  @Query(() => String)
  async HealthCheck() {
    console.log("HEALTH");
    return "Healthy Line Established";
  }
}
