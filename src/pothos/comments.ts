import { Comments } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GraphQLError } from "graphql";

import { builder, prisma } from "./builder";

export const CommentsObject = builder.objectRef<Comments>("Comment");

CommentsObject.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    body: t.exposeString("body"),
  }),
});

builder.queryField("comment", (t) =>
  t.field({
    type: CommentsObject,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (parent, args, context) => {
      try {
        const comment = await prisma.comments.findUniqueOrThrow({
          where: {
            id: args.id,
          },
        });

        return comment;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return Promise.reject(
            new GraphQLError(`Cannot find comment with id ${args.id}`)
          );
        }

        return Promise.reject(error);
      }
    },
  })
);

const CreateCommentInput = builder.inputType("CreateCommentInput", {
  fields: (t) => ({
    todoId: t.string({ required: true }),
    body: t.string({ required: true }),
  }),
});

builder.mutationField("postCommentOnTodo", (t) =>
  t.field({
    type: CommentsObject,
    args: {
      input: t.arg({ type: CreateCommentInput, required: true }),
    },
    resolve: async (parent, args) => {
      try {
        const comment = await prisma.comments.create({
          data: {
            body: args.input.body,
            todoId: args.input.todoId,
          },
        });
        return comment;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code == "P2003"
        ) {
          return Promise.reject(
            new GraphQLError(
              `Cannot add comment on a non-exiting todo with id ${args.input.todoId}`
            )
          );
        }
        return Promise.reject(error);
      }
    },
  })
);
