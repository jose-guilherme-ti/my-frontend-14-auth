'use client';
import React, { useEffect, useState, ReactNode, createElement } from 'react';
// Importe a tipagem global que você já definiu
// declare global { interface Window { useSharedStateRemote: any; ... } }

export function RemoteAppProviders({ children }: { children: ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [remoteProvider, setRemoteProvider] = useState<any>(null);

    useEffect(() => {
        window.React = React; // Garante o Shared React
        // ... (Adicione window.ReactDOM e window.__webpack_share_scopes__.default = {} aqui também, como no seu page.tsx)

        async function loadRemoteProvider() {
            try {
                const container = await eval(`import('http://localhost:5001/remote-app/assets/remoteEntry.js')`);
                await container.init({ /* ... shared react config ... */ });
                
                const providerModuleFactory = await container.get('./MyProvider');
                const providerModule = providerModuleFactory();

                // 1. Anexamos o hook 'useSharedState' ao objeto window
                window.useSharedStateRemote = providerModule.useSharedState || providerModule.default?.useSharedState;

                // 2. Armazenamos o componente 'MyProvider' no estado
                setRemoteProvider(() => providerModule.MyProvider || providerModule.default?.MyProvider);
                setIsLoaded(true);
            } catch (err) {
                console.error("Falha ao carregar o provedor remoto:", err);
            }
        }
        loadRemoteProvider();
    }, []);

    if (!isLoaded || !remoteProvider) return <p>Carregando Provedor Remoto...</p>;

    // Envolve o resto da aplicação com o Provider remoto
    return createElement(remoteProvider, {}, children);
}

// Atualize sua tipagem global para incluir o hook remoto
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __webpack_share_scopes__: any;
    useSharedStateRemote: any; 
  }
}
