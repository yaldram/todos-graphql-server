import { createApplication } from "graphql-modules";

import { todosModule } from "./todos";
import { commentsModule } from "./comments";

export const application = createApplication({
  modules: [todosModule, commentsModule],
});
