'use client';
import React, { useState, useEffect } from 'react';

export default function MicroFrontendLoader() {
  const [Content, setContent] = useState<any>(null);

  useEffect(() => {
    const initFederation = async () => {
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
              shareConfig: {
                singleton: true,
                requiredVersion: false // Adicione esta linha
              }
            },
            'react-dom': {
              version: '18.2.0',
              lib: () => ReactDOMInstance.default || ReactDOMInstance,
              shareConfig: {
                singleton: true,
                requiredVersion: false // Adicione esta linha
              }
            },
          },
        });

        const [pMod, cMod, bMod] = await Promise.all([
          loadRemote('remote_app/MyProvider'),
          loadRemote('remote_app/CarouselMF'),
          loadRemote('remote_app/Button')
        ]);

        // FUNÇÃO DE EXTRAÇÃO DEFINITIVA
        const getComponent = (mod: any) => {
          if (!mod) return null;
          // Camadas comuns de ESM/Vite: mod.default.default ou mod.default
          let comp = mod.default?.default || mod.default || mod;

          // Se ainda for um objeto e não uma função, busca a primeira exportação funcional
          if (typeof comp !== 'function' && typeof comp === 'object') {
            const firstFunc = Object.values(comp).find(v => typeof v === 'function');
            if (firstFunc) comp = firstFunc;
          }
          return comp;
        };

        const Provider = getComponent(pMod);
        const Carousel = getComponent(cMod);
        const Button = getComponent(bMod);


        if (typeof Provider !== 'function' || typeof Carousel !== 'function' || typeof Button !== 'function') {
          console.error("Módulos não carregaram como funções:", { Provider, Carousel, Button });
          return;
        }

        // Criamos o componente Combined fixando as referências
        const CombinedComponent = (props: any) => {
          const ValidProvider = Provider;
          const ValidCarousel = Carousel;
          const ValidButton = Button;
          return (
            <ValidProvider>
              <ValidButton className={true} name="Micro front" />
              <ValidCarousel {...props} />
            </ValidProvider>
          );
        };

        // Importante: Passamos uma factory function para o useState
        setContent(() => CombinedComponent);
      } catch (err) {
        console.error("Erro Federation:", err);
      }
    };

    initFederation();
  }, []);

  if (!Content) return <div>Carregando Micro-frontend...</div>;

  // Renderizamos o componente armazenado no estado
  const RemoteApp = Content;

  return (
    <RemoteApp items={[
      { title: "Sucesso", description: "Vite + Next 14", image: "https://picsum.photos/800/300?1" },
      { title: "Ai sim", description: "Teste 2", image: "https://picsum.photos/800/300?2" }
    ]} />
  );
}
