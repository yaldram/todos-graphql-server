import "graphql-import-node";

import { createServer } from "http";
import { createYoga } from "graphql-yoga";
import { useGraphQLModules } from "@envelop/graphql-modules";

import { createContext } from "./context";
import { application } from "./modules";

function main() {
  const yoga = createYoga({
    schema: application.schema,
    context: createContext,
    plugins: [useGraphQLModules(application)],
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.log("Server started on Port no. 4000");
  });
}

main();
