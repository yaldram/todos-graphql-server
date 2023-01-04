import { makeExecutableSchema } from "@graphql-tools/schema";
import { Todos } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GraphQLError } from "graphql";

import { GraphQLContext } from "./context";

const typeDefinitions = `
  enum TaskStatus {
    PENDING
    IN_PROGRESS
    DONE
  }

  type Todo {
    id: String!
    task: String!
    description: String!
    status: TaskStatus!
    tags: [String]!
    comments: [Comment]
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    body: String!
  }

  type Query {
    todos: [Todo]!
    comment(id: ID!): Comment!
  }

  input TodoInput {
    task: String!
    description: String!
    status: TaskStatus!
    tags: [String]
  }

  input CommentInput {
    todoId: ID!
    body: String!
  }

  input EditTodoInput {
    id: ID!
    task: String!
    description: String!
    status: TaskStatus!
    tags: [String]
  }

  input DeleteTodoInput {
    id: ID!
  }

  type Mutation {
    addTodo(input: TodoInput): Todo!
    editTodo(input: EditTodoInput): Todo!
    deleteTodo(input: DeleteTodoInput): Todo!
    postCommentOnTodo(input: CommentInput): Comment!
  }
`;

const resolvers = {
  Query: {
    todos(parent: unknown, args: {}, context: GraphQLContext) {
      return context.prisma.todos.findMany();
    },
    comment(parent: unknown, args: { id: string }, context: GraphQLContext) {
      return context.prisma.comments.findUnique({
        where: {
          id: args.id,
        },
      });
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

export const schema = makeExecutableSchema({
  typeDefs: [typeDefinitions],
  resolvers: [resolvers],
});
