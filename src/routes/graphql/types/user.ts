import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { userSchema } from '../../users/schemas.js';
import { Static } from '@sinclair/typebox';
import { Context } from '../index.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType<Static<typeof userSchema>, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _args, context: Context) => {
        return context.prisma.post.findMany({ where: { authorId: user.id } });
      },
    },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, context: Context) => {
        return context.prisma.profile.findUnique({ where: { userId: user.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, context: Context) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, context: Context) => {
        return (context.prisma.user).findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
      },
    },
  }),
});


export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});