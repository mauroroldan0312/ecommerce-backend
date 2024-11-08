import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    lastName: String!
    email: String!
    userType: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type ImagesProduct {
    imageId: String!
    imageLabel: String!
    imageTag: String!
    imageUrl: String!
    imageText: String!
    imageLastModified: String!
  }

  type ItemProduct {
    itemId: String!
    name: String!
    images: [ImagesProduct!]!
    sellers: [SellerProduct!]!
  }

  type CommertialOfferProduct {
    Price: Int!
    ListPrice: Int!
    IsAvailable: Boolean!
  }

  type SellerProduct {
    commertialOffer: CommertialOfferProduct!
  }

  type Product {
    productId: String!
    brand: String!
    productTitle: String!
    items: [ItemProduct!]!
  }

  type Query {
    login(username: String!, password: String!): AuthPayload
    me: User
    products(queryParams: String!): [Product!]!
  }

  type Mutation {
    updateUser(
      id: ID!
      username: String!
      name: String!
      lastName: String!
      email: String!
      userType: String!
    ): User!
  }
`;
