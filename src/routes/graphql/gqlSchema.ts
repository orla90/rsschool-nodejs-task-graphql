import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { GQLQueryType } from './types/query.js';
import { MemberType } from './types/member.js';
import { UserType } from './types/user.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';

export interface Context {
  db: PrismaClient;
};

export const gqlSchema = new GraphQLSchema({
  query: GQLQueryType,
  types: [MemberType, UserType, ProfileType, PostType],
});