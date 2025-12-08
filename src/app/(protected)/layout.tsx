"use client";

import dynamic from "next/dynamic";
import { Providers } from "../providers";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function ProtectedLayout({ children }) {
  return (
    <>
    {/* <Providers> */}
      <Header />
      <main>{children}</main>
    {/* </Providers>   */}
    </>
  );
}
