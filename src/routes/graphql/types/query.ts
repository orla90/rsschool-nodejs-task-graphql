import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdEnum } from './member.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';
import { Context } from '../index.js';

export const GQLQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent, _args, context: Context) => {
        const memberTypes = await context.prisma.memberType.findMany()
        return memberTypes;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeIdEnum },
      },
      resolve: async (_parent, args: { id: string }, context: Context) => {
        const memberType = await context.prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
        return memberType;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: { id: string }, context: Context) => {
        return context.prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: { id: string }, context: Context) => {
        return context.prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_parent, _args, context: Context) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_parent, args: { id: string }, context: Context) => {
        return context.prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
