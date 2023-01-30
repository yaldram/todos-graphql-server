# graphql-server

> Implemented a Graphql Server using schema-first and code-first approaches. Libraries used - prisma, graphql-yoga, graphql-modules, pothos.

### Introduction

- I have implemented Graphql server using multiple approaches, schema first approach using Graphql Yoga and code first approach using Pothos.
- First approach is the schema first approach with a single schema, but it is not maintainable in the long run. Please check the `schema-first` branch.
- For creating modular schema first code I used `graphql-modules`, it gives us the ability to modularize our codebase. Rather than having a single huge schema, we can divide our schema and resolvers into respective folders. Please check the `graphql-modules` branch.
- The best approach (very similar to trpc I would say) is the code first approach, we get full type-safety and modularity, the code is very readable no need to have separate schema and resolver files. Please check the `graphql-pothos` branch.
- Lastly, pothos has an awesome plugin to use with prisma which eases the development, has complete typesafety, takes care of the prisma relations. Please check the `pothos-prisma-plugin` branch.

### My Learnings

- Graphql has come a long way, I still remember using webpack back in 2019 for modular graphql schema, but with graphql modules we don't need any other build tool.
- Code first graphql is awesome, I have decided to use pothos for all my graphql projects from now, it has awesome typesafety, the dev experience is great, it works out of the box with graphql-yoga, prisma and has a lot of plugins too.
- I have always used `ts-node` for my typescript projects, but for this project I used `esbuild` with the awesome `esbuild-node-tsc` package. I will now only use `esbuild` along with `esbuild-node-tsc` for my node typescript projects.
- For my postgres database I am using `bit.io` a serverless postgres database service with a generous free tier (1 Billion reads per month).

### Usage

- Clone the project.
- Run `yarn install`.
- Run `yarn start` to run the project.
- To build the project run `yarn build`.

### License

MIT © [github.com/yaldram](https://github.com/github.com/yaldram)
