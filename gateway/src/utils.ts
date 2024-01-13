import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import "dotenv/config";

export const getUser = (authorization) => {
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    try {
      const user = jwt.verify(token, secret);
      return user;
    } catch (err) {
      throw new GraphQLError(err.message, {
        extensions: {
          code: err.name,
        },
      });
    }
  }
  return null;
};
