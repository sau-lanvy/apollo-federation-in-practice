import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import express from "express";
import cors from "cors";
import 'dotenv/config'
import initGateway from "./apollo";
import { getUser } from "./utils";

const app = express();
const httpServer = http.createServer(app);

const gateway = initGateway(httpServer);
await gateway.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json({ limit: '50mb'}),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(gateway, {
    context: async ({ req }) => { 
      // Get the user token from the headers.
      const authorization = req.headers.authorization || '';
      // Try to retrieve a user with the token
      const user = getUser(authorization);
      // Add the user to the context of the apollo gateway
      return { user: user };
    }
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve)
);

console.log(`🚀 Server ready at http://localhost:${process.env.PORT }/graphql`);
