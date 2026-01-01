"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { RemoteAppProviders } from "@/app/RemoteAppProviders"; // Importe o novo arquivo
// Importe a AppRouterCacheProvider do MUI para garantir a ordem correta do CSS
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    // Envolve todo o app para gerenciar o cache do CSS do MUI
      <div >
        <Header />
        
        {/* Container principal para o conteúdo */}
        
        <main 
         /*  className=" css-i9gxme"  */
          style={{  padding: '20px' }}
        >
          {/* Aplica position: relative ao container interno */}
          <div /*  style={{ margin: '0 auto', position: 'relative' }} */>
            {children} {/* O conteúdo da sua página entra aqui */}
          </div>
        </main>
      </div>
  );
}
