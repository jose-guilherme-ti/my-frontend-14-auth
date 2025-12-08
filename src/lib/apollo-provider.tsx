"use client";

import { ApolloProvider } from "@apollo/client/react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 🚫 Ignora Apollo na página de login
  if (pathname === "/login") return <>{children}</>;

  const token = (session as any)?.accessToken ?? "";

  const client = useMemo(() => {
    if (status !== "authenticated") return null;

    const httpLink = new HttpLink({
      uri: "http://localhost:4000/graphql",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const wsLink =
      typeof window !== "undefined"
        ? new GraphQLWsLink(
            createClient({
              url: "ws://localhost:4000/graphql",
              connectionParams: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            })
          )
        : null;

    const link = wsLink
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return (
              def.kind === "OperationDefinition" &&
              def.operation === "subscription"
            );
          },
          wsLink,
          httpLink
        )
      : httpLink;

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }, [status, token]);

  if (status === "loading") return null;
  if (!client) return null;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
