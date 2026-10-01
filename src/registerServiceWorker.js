// Service-worker registration is not wired up in the Vite build.
//
// The old vue-cli build used @vue/cli-plugin-pwa + register-service-worker.
// To bring back offline support, add `vite-plugin-pwa` and register its
// virtual module here, then call this from src/main.js.
//
// Left intentionally inert so it never silently references a missing package.
export function registerServiceWorker() {
  return undefined;
}