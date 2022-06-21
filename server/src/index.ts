import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from "./resolvers";
import { connectToMongoDb } from "./utils/mongodb";
import { verifyJWT } from "./utils/JWT";
import Context from "./types/context";
import { User } from "./schema/user.schema";
import { weeklyCount } from "./ScheduledJobs";
const schedule = require("node-schedule");

schedule.scheduleJob("0 0 * * 0", () => {
  console.log("Ran");
  weeklyCount();
});

const serverFunction = async () => {
  const schema = await buildSchema({
    resolvers,
    // authChecker,
  });

  const app = express();
  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const authToken = ctx.req.headers.authorization;
      // console.log(authToken);
      if (authToken) {
        const user = verifyJWT(authToken.replace("Bearer ", "")) as User;
        ctx.user = user;
      }
      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageLocalDefault(),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 9000 }, () => {
    console.log("Server is running at http://localhost:9000");
  });

  connectToMongoDb();
};

serverFunction();
