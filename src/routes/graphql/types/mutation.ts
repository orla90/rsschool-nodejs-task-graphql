import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from 'graphql';
import {
  UserType,
  ChangeUserInputType,
  CreateUserInputType,
} from './user.js';
import {
  ChangePostInputType,
  CreatePostInputType,
  PostType,
} from './post.js';
import {
  ProfileType,
  CreateProfileInputType,
  ChangeProfileInputType,
} from './profile.js';
import { UUIDType } from './uuid.js';
import { changeProfileByIdSchema, createProfileSchema } from '../../profiles/schemas.js';
import { Static } from '@sinclair/typebox';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';
import { changeUserByIdSchema, createUserSchema } from '../../users/schemas.js';
import { Context } from '../index.js';

export const mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: CreateUserInputType },
      },
      resolve: async (
        _parent,
        { dto }: { dto: Static<(typeof createUserSchema)['body']> },
        context: Context
      ) => {
        return context.prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeUserInputType },
      },
      resolve: async (
        _parent,
        { dto, id }: { dto: Static<(typeof changeUserByIdSchema)['body']>; id: string },
        context: Context
      ) => {
        return context.prisma.user.update({
          where: { id }, data: dto
        });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (
        _parent,
        { id }: { id: string },
        context: Context
      ) => {
        try {
          await context.prisma.user.delete({
            where: { id }
          });
          return true;
        } catch {
          return false;
        }
      },
    },
    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        await context.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId,
              },
            },
          },
        });
        return userId;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: UUIDType },
        authorId: { type: UUIDType },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        try {
          await context.prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId,
              },
            },
          });
          return authorId;
        } catch (error) {
          return false;
        }
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInputType },
      },
      resolve: async (
        _parent, { dto }: { dto: Static<(typeof createPostSchema)['body']> },
        context: Context
      ) => {
        return context.prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangePostInputType },
      },
      resolve: async (
        _parent,
        { dto, id }: { dto: Static<(typeof changePostByIdSchema)['body']>; id: string },
        context: Context
      ) => {
        return context.prisma.post.update({
          where: { id }, data: dto
        });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (
        _parent, { id }: { id: string },
        context: Context
      ) => {
        try {
          await context.prisma.post.delete({
            where: { id }
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: CreateProfileInputType },
      },
      resolve: async (
        _parent,
        { dto }: { dto: Static<(typeof createProfileSchema)['body']> },
        context: Context
      ) => {
        return context.prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
        dto: { type: ChangeProfileInputType },
      },
      resolve: async (
        _parent,
        { dto, id }: { dto: Static<(typeof changeProfileByIdSchema)['body']>; id: string },
        context,
      ) => {
        return context.prisma.profile.update({
          where: { id }, data: dto
        });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (
        _parent,
        { id }: { id: string },
        context: Context
      ) => {
        try {
          await context.prisma.profile.delete({
            where: { id }
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
  },
});