"use client";

import dynamic from "next/dynamic";

// Impede qualquer SSR (solução definitiva para MUI + NextAuth)
const LoginForm = dynamic(() => import("./LoginForm"), {
  ssr: false,
});

export default function Page() {
  return <LoginForm />;
}