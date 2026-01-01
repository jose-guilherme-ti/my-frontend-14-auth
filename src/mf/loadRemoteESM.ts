// src/mf/loadRemoteESM.ts
'use client';

export function loadRemoteESM<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = url;

    script.onload = async () => {
      try {
        // @ts-ignore
        resolve(window.__REMOTE__);
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = () =>
      reject(new Error(`Erro ao carregar ${url}`));

    document.body.appendChild(script);
  });
}
