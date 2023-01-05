import SchemaBuilder from "@pothos/core";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const builder = new SchemaBuilder({});

builder.queryType();
builder.mutationType();
