import { createServer } from "http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema";
import { createContext } from "./context";

function main() {
  const yoga = createYoga({
    schema,
    context: createContext(),
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.log("Server started on Port no. 4000");
  });
}

main();
