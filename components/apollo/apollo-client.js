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
    uri: "http://62.84.116.219:8081/v1/graphql",
    headers: {
      "x-hasura-admin-secret": "mysecretkey",
      /* Authorization: `Bearer ${authToken}`, */
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
