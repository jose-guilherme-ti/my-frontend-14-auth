'use client';
import React, { useState, useEffect } from 'react';

export default function FederatedWrapper() {
  const [Content, setContent] = useState<React.ComponentType<any> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const loadRemoteModules = async () => {
      try {
        const { init, loadRemote } = await import('@module-federation/enhanced/runtime');
        const ReactInstance = await import('react');
        const ReactDOMInstance = await import('react-dom');

        init({
          name: 'host',
          remotes: [{
            name: 'remote_app',
            entry: 'http://localhost:5001/assets/remoteEntry.js',
            type: 'module',
          }],
          shared: {
            react: { 
              version: '18.2.0', 
              lib: () => ReactInstance.default || ReactInstance, 
              shareConfig: { singleton: true, requiredVersion: false } 
            },
            'react-dom': { 
              version: '18.2.0', 
              lib: () => ReactDOMInstance.default || ReactDOMInstance, 
              shareConfig: { singleton: true, requiredVersion: false } 
            },
          },
        });

        const [pMod, cMod] = await Promise.all([
          loadRemote('remote_app/MyProvider'),
          loadRemote('remote_app/CarouselMF')
        ]);

        // FUNÇÃO DE EXTRAÇÃO EXAUSTIVA
        const extractComponent = (mod: any) => {
          if (!mod) return null;
          // 1. Tenta extrações padrão de default export
          let component = mod.default?.default || mod.default || mod;
          
          // 2. Se ainda for um objeto, procura pela primeira propriedade que seja uma função
          if (typeof component !== 'function' && typeof component === 'object') {
            const firstFunc = Object.values(component).find(v => typeof v === 'function');
            if (firstFunc) component = firstFunc;
          }
          
          return typeof component === 'function' ? component : null;
        };

        const ProviderComp = extractComponent(pMod);
        const CarouselComp = extractComponent(cMod);

        if (!ProviderComp || !CarouselComp) {
          throw new Error("Não foi possível encontrar uma função válida nos módulos remotos.");
        }

        // Criamos o componente Combined garantindo referências locais estáveis
        const Combined = (props: any) => {
          const P = ProviderComp;
          const C = CarouselComp;
          return (
            <P>
              <C {...props} />
            </P>
          );
        };

        // Importante: Passar como uma factory function para o useState
        setContent(() => Combined);
      } catch (err) {
        console.error("Erro Crítico Federation:", err);
      }
    };

    loadRemoteModules();
  }, []);

  if (!isClient || !Content) return <div style={{ padding: '20px' }}>Carregando Micro-frontend...</div>;

  const RemoteApp = Content;
  return (
    <RemoteApp items={[
      { title: "Item 1", description: "Vite + Next 14", image: "https://picsum.photos/800/300?1" },
      { title: "Item 2", description: "Integração 2026", image: "https://picsum.photos/800/300?2" }
    ]} />
  );
}
