"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "./Navbar";

export default function NavbarContainer() {
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (loading) {
    return <Navbar loading={true} />;
  }

  return (
    <Navbar
      loading={false}
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
    />
  );
}
