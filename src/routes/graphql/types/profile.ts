import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType } from './member.js';
import { Context } from '../gqlSchema.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: UserType,
      resolve: async (profile, _args, context: Context) => {
        return context.db.user.findUnique({ where: { id: profile.userId } });
      },
    },
    userId: { type: UUIDType },
    memberType: {
      type: MemberType,
      resolve: async (profile, _args, context: Context) => {
        return context.db.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
    memberTypeId: { type: UUIDType },
  }),
});
