import "graphql-import-node";

import { createServer } from "http";
import { createYoga } from "graphql-yoga";

import { schema } from "./pothos-prisma";

/**
 * Create different main functions
 */
function main() {
  const yoga = createYoga({
    schema: schema,
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.log("Server started on Port no. 4000");
  });
}

main();
