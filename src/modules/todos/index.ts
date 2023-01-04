import { createModule } from "graphql-modules";

import * as TodosSchema from "./schema.graphql";
import { todosResolvers } from "./resolvers";

export const todosModule = createModule({
  id: "todos-module",
  dirname: __dirname,
  typeDefs: [TodosSchema],
  resolvers: todosResolvers,
});
