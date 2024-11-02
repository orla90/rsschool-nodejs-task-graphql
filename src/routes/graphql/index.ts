import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, validate, parse } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { GQLQueryType } from './types/query.js';
import { mutations } from './types/mutation.js';
import depthLimit from 'graphql-depth-limit';

export interface Context {
  prisma: PrismaClient;
};

export const gqlSchema = new GraphQLSchema({
  query: GQLQueryType,
  mutation: mutations,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      try {
        const { query, variables } = req.body;

        const validationErrors = validate(gqlSchema, parse(query), [
          depthLimit(5),
        ]);

        if (validationErrors.length) return { errors: validationErrors };

        return graphql({
          schema: gqlSchema,
          source: query,
          variableValues: variables,
          contextValue: { prisma },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
};

export default plugin;
