'use client';
import { useRemoteCounter } from '@/hooks/useRemoteCounter';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState, createElement, Fragment, useRef } from 'react';
import ReactDOM from 'react-dom';




export default function MultiRemotePage() {
  const [remotes, setRemotes] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const count = useRemoteCounter();
  const hasTriggered = useRef(false);

  const carouselItems = [
    { title: "Sucesso", description: "Vite + Next 14", image: "https://picsum.photos/800/300?1" },
    { title: "Múltiplos", description: "Configuração 2026", image: "https://picsum.photos/800/300?2" }
  ];



  useEffect(() => {
    window.React = React;
    window.ReactDOM = ReactDOM;

    async function load() {
      try {
        const remoteUrl = `http://localhost:5001/remote-app/assets/remoteEntry.js?t=${Date.now()}`;
        const container = await eval(`import('${remoteUrl}')`);

        if (!window.__webpack_share_scopes__) {
          window.__webpack_share_scopes__ = { default: {} };
        }

        await container.init({
          react: {
            '18.2.0': {
              get: () => Promise.resolve(() => React),
              loaded: true
            },
          },
        });

        const fetchRemote = async (scope: string) => {
          const factory = await container.get(scope);
          const module = factory();

          // AJUSTE CRÍTICO: Extração profunda do componente
          // Vite costuma retornar { default: Component } ou { CarouselMF: Component }
          let Component = module.default || module;

          // Se ainda for um objeto (e não uma função), tenta pegar a primeira chave válida
          if (typeof Component !== 'function' && typeof Component === 'object') {
            const keys = Object.keys(Component).filter(k => k !== '__esModule');
            Component = Component[keys[0]];
          }

          return Component;
        };

        const [Carousel, Button, MyProvider] = await Promise.all([
          fetchRemote('./CarouselMF'),
          fetchRemote('./Button'),
          fetchRemote('./MyProvider'),
        ]);

        setRemotes({ Carousel, Button, MyProvider });
      } catch (err: any) {
        console.error("Erro na Federação:", err);
        setError(err.message);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (count === 10 && !hasTriggered.current) {
      hasTriggered.current = true;
      alert("Contador chegou a 10!");
    }
  }, [count]);

  if (error) return <div className="p-8 text-red-500 font-mono">Erro de Carregamento: {error}</div>;

  if (!remotes) {
    return <div className="p-8 animate-pulse text-gray-500">Sincronizando instâncias do React...</div>;
  }

  // Helper para renderizar com segurança
  const renderRemote = (Component: any, props: any = {}, children: any = null) => {
    if (typeof Component !== 'function' && typeof Component !== 'string') {
      console.error("Componente inválido detectado:", Component);
      return <div className="text-red-500 text-xs">Falha ao renderizar componente (Tipo inválido)</div>;
    }
    return createElement(Component, props, children);
  };

  return (
    /* ESTA É A SUA DIV PRINCIPAL OU COMPONENTE BOX DO MUI */
    // Envolve o conteúdo no Cache Provider para priorizar o CSS do Host
    /*  <AppRouterCacheProvider options={{ enableCssLayer: true }}> */

    <Box >
      <h1 className="text-2xl font-bold mb-4">Área Administrativa</h1>

      {renderRemote(remotes.MyProvider, {},
        <Fragment>
          <Box sx={{ mb: 4 }}>
            {renderRemote(remotes.Carousel, { items: carouselItems })}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderRemote(remotes.Button, { name: 'Salvar', onClick: () => alert('OK') })}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderRemote(remotes.Button, { name: 'Cancelar', className: true, onClick: () => alert('OK') })}
          </Box>

          {/* <p>{count}</p>
        <button onClick={increment}>+</button> */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Contador no HOST: {count}
          </Typography>
        </Fragment>
      )}
    </Box>
    /*  </AppRouterCacheProvider> */
  );
}

declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __webpack_share_scopes__: any;
  }
}
