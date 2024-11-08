import { getProducts, login, updateUser } from "../routes";
import { getUser } from "../routes/middleware";

export const resolvers = {
  Query: {
    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const response = await login(username, password);

      if (response.status === 401) {
        throw new Error(response.message);
      }

      return {
        token: response.token,
        user: response.user,
      };
    },
    me: async (_: any, __: any, { req }: { req: any }) => {
      const token = req.headers.authorization?.split(" ")[1];
      const response = await getUser(token);

      if (response.status !== 200) {
        throw new Error(response.message);
      }

      return response.user;
    },
    products: async (_: any, { queryParams }: { queryParams: string }) => {
      const response = await getProducts(queryParams);

      if (response.status === 500) {
        throw new Error(response.message);
      }

      return response.products;
    },
  },
  Mutation: {
    updateUser: async (
      _: any,
      {
        id,
        username,
        name,
        lastName,
        email,
        userType,
      }: {
        id: string;
        username: string;
        name: string;
        lastName: string;
        email: string;
        userType: string;
      }
    ) => {
      try {
        const response = await updateUser(
          id,
          username,
          name,
          lastName,
          email,
          userType
        );

        if (response.status === 500) {
          throw new Error(response.message);
        }

        return response.updatedUser;
      } catch (error) {
        throw new Error("Error updating user");
      }
    },
  },
};
