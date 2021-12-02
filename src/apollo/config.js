import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const baseURL = 'https://api.monday.com/v2';
export const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjEzNTU0NjYyMywidWlkIjoyNjI5NjMwMywiaWFkIjoiMjAyMS0xMi0wMlQxMTowNzo0NS45MThaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTA1NTk0MzEsInJnbiI6InVzZTEifQ.8yF5KXTxKKoOgtCfGgvEVtO0ZmeJrn8PWKKW6OnPMJ8';

const httpLink = createHttpLink({
  uri: baseURL,
});
const httpLinkFile = createHttpLink({
  uri: `${baseURL}/file`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token,
    }
  }
});
const authLinkFile = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token,
      "Content-Type": "multipart/form-data"
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const fileClient = new ApolloClient({
  link: authLinkFile.concat(httpLinkFile),
  cache: new InMemoryCache()
});
