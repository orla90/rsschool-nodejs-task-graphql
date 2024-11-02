import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType, MemberTypeIdEnum } from './member.js';
import { Static } from '@sinclair/typebox';
import { profileSchema } from '../../profiles/schemas.js';
import { Context } from '../index.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType<Static<typeof profileSchema>, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },

    user: {
      type: UserType,
      resolve: async (profile, _args, context: Context) => {
        return context.prisma.user.findUnique({ where: { id: profile.userId } });
      },
    },
    memberType: {
      type: MemberType,
      resolve: async (profile, _args, context: Context) => {
        return context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});