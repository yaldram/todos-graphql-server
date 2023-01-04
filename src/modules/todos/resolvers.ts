import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GraphQLError } from "graphql";
import { Todos } from "@prisma/client";

import { GraphQLContext } from "../../context";

export const todosResolvers = {
  Query: {
    todos(parent: unknown, args: {}, context: GraphQLContext) {
      return context.prisma.todos.findMany();
    },
  },
  Todo: {
    comments(parent: Todos, args: {}, context: GraphQLContext) {
      return context.prisma.comments.findMany({
        where: {
          todoId: parent.id,
        },
      });
    },
  },
  Mutation: {
    addTodo(parent: unknown, args: { input: Todos }, context: GraphQLContext) {
      return context.prisma.todos.create({
        data: {
          task: args.input.task,
          description: args.input.description,
          status: args.input.status,
          tags: args.input.tags,
        },
      });
    },
    async editTodo(
      parent: unknown,
      args: { input: Todos },
      context: GraphQLContext
    ) {
      const todoId = args.input.id;

      try {
        const todo = await context.prisma.todos.update({
          data: {
            task: args.input.task,
            description: args.input.description,
            status: args.input.status,
            tags: args.input.tags,
          },
          where: {
            id: todoId,
          },
        });

        return todo;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code == "P2003"
        ) {
          return Promise.reject(
            new GraphQLError(
              `Cannot delete a non-exiting todo with id ${todoId}`
            )
          );
        }

        return Promise.reject(error);
      }
    },
    async deleteTodo(
      parent: unknown,
      args: { input: Pick<Todos, "id"> },
      context: GraphQLContext
    ) {
      const todoId = args.input.id;

      try {
        const todo = await context.prisma.todos.delete({
          where: {
            id: todoId,
          },
        });

        return todo;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code == "P2003"
        ) {
          return Promise.reject(
            new GraphQLError(
              `Cannot delete a non-exiting todo with id ${todoId}`
            )
          );
        }

        return Promise.reject(error);
      }
    },
  },
};
