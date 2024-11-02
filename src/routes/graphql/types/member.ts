import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';
import { Static } from '@sinclair/typebox';
import { memberTypeSchema } from '../../member-types/schemas.js';
import { Context } from '../index.js';

export const MemberTypeIdEnum: GraphQLEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberType: GraphQLObjectType = new GraphQLObjectType<Static<typeof memberTypeSchema>, Context>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

