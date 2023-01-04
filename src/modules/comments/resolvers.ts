import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GraphQLError } from "graphql";

import { GraphQLContext } from "../../context";

export const commentsResolvers = {
  Query: {
    comment(parent: unknown, args: { id: string }, context: GraphQLContext) {
      return context.prisma.comments.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    async postCommentOnTodo(
      parent: unknown,
      args: { input: { todoId: string; body: string } },
      context: GraphQLContext
    ) {
      const todoId = args.input.todoId;

      try {
        const comment = await context.prisma.comments.create({
          data: {
            todoId,
            body: args.input.body,
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
              `Cannot comment on a non-exiting todo with id ${todoId}`
            )
          );
        }

        return Promise.reject(error);
      }
    },
  },
};
