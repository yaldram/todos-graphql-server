import { TaskStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { GraphQLError } from "graphql";
import { prisma, builder } from "./builder";

builder.enumType(TaskStatus, {
  name: "TaskStatus",
});

builder.prismaObject("Todos", {
  fields: (t) => ({
    id: t.exposeID("id"),
    task: t.exposeString("task"),
    description: t.exposeString("description"),
    status: t.field({
      type: TaskStatus,
      resolve: (parent) => parent.status,
    }),
    tags: t.exposeStringList("tags"),
    comments: t.relation("Comments"),
  }),
});

builder.queryField("todos", (t) =>
  t.prismaField({
    type: ["Todos"],
    resolve: (query) => prisma.todos.findMany({ ...query }),
  })
);

const CreateTodoInput = builder.inputType("CreateTodoInput", {
  fields: (t) => ({
    task: t.string({ required: true }),
    description: t.string({ required: true }),
    status: t.field({
      type: TaskStatus,
      required: true,
    }),
    tags: t.stringList({ required: true }),
  }),
});

builder.mutationField("addTodo", (t) =>
  t.prismaField({
    type: "Todos",
    args: {
      input: t.arg({ type: CreateTodoInput, required: true }),
    },
    resolve: (query, parent, args) =>
      prisma.todos.create({
        data: {
          task: args.input.task,
          description: args.input.description,
          status: args.input.status,
          tags: args.input.tags,
        },
      }),
  })
);

const EditTodoInput = builder.inputType("EditTodoInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
    task: t.string({ required: true }),
    description: t.string({ required: true }),
    status: t.field({
      type: TaskStatus,
      required: true,
    }),
    tags: t.stringList({ required: true }),
  }),
});

builder.mutationField("editTodo", (t) =>
  t.prismaField({
    type: "Todos",
    args: {
      input: t.arg({ type: EditTodoInput, required: true }),
    },
    resolve: async (query, parent, args) => {
      const todoId = args.input.id;

      try {
        const todo = await prisma.todos.update({
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
          error.code == "P2025"
        ) {
          return Promise.reject(
            new GraphQLError(`Cannot edit a non-exiting todo with id ${todoId}`)
          );
        }
        return Promise.reject(error);
      }
    },
  })
);

const DeleteTodoInput = builder.inputType("DeletesTodoInput", {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

builder.mutationField("deleteTodo", (t) =>
  t.prismaField({
    type: "Todos",
    args: {
      input: t.arg({ type: DeleteTodoInput, required: true }),
    },
    resolve: async (query, parent, args) => {
      const todoId = args.input.id;

      try {
        const todo = await prisma.todos.delete({
          where: {
            id: todoId,
          },
        });

        return todo;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code == "P2025"
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
  })
);
