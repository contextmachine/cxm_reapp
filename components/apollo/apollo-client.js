import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  HttpLink,
} from "@apollo/client";

const defaultOptions = {
  query: {
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://viewer.contextmachine.online/v1/graphql",
    headers: {
      "x-hasura-admin-secret": "mysecretkey",
      /* Authorization: `Bearer ${authToken}`, */
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
