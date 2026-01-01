"use client";

import { SessionProvider } from "next-auth/react";
import ApolloWrapper from "@/lib/apollo-provider";
import { ThemeSwitcherProvider } from "@/contexts/ThemeContext";


export function Providers({ children }) {
  return (
    <SessionProvider>
      <ApolloWrapper>
        <ThemeSwitcherProvider>
            {children}
        </ThemeSwitcherProvider>
      </ApolloWrapper>
    </SessionProvider>
  );
}
