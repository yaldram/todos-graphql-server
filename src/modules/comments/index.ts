import { createModule } from "graphql-modules";

import * as CommentsSchema from "./schema.graphql";
import { commentsResolvers } from "./resolvers";

export const commentsModule = createModule({
  id: "comments-module",
  dirname: __dirname,
  typeDefs: [CommentsSchema],
  resolvers: commentsResolvers,
});
