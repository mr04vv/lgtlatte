import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE}`;

const link = new HttpLink({
  uri: URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
  fetchOptions: {
    cache: "force-cache",
  },
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link,
  cache,
});
