import "./todos";
import "./comments";

import { builder } from "./builder";

// Create and export our graphql schema
export const schema = builder.toSchema();
