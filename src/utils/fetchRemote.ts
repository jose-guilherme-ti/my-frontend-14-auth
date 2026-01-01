import React from "react";

export async function fetchRemote(scope: string) {
 const remoteUrl = `http://localhost:5001/remote-app/assets/remoteEntry.js?t=${Date.now()}`;
  const container: any = await import(/* @vite-ignore */ remoteUrl);

  if (!window.__webpack_share_scopes__) {
    window.__webpack_share_scopes__ = { default: {} };
  }

  await container.init({
    react: {
      '18.2.0': {
        get: () => Promise.resolve(() => React),
        loaded: true,
      },
    },
  });

  const factory = await container.get(scope);
  const module = factory();

  let Component = module.default || module;

  if (typeof Component === 'object') {
    const keys = Object.keys(Component).filter(k => k !== '__esModule');
    Component = Component[keys[0]];
  }

  return Component;
}
