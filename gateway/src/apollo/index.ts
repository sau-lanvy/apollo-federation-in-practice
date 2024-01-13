import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} from "@apollo/gateway";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import "dotenv/config";

type AuthUser = {
  id: String;
  email: String;
  roles: String[];
}

type AuthContext = {
  user?: AuthUser;
}

const initGateway = (httpServer) => {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [{ name: "accounts", url: process.env.ACCOUNTS_ENDPOINT }],
    }),
    buildService({ name, url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }) {
          if (context.user) {
            console.log(JSON.stringify(context.user));
            request.http.headers.set("user", JSON.stringify(context.user));
          }
        },
      });
    },
    debug: true
  });

  return new ApolloServer<AuthContext>({
    gateway,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
};

export default initGateway;
