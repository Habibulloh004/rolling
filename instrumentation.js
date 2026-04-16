function disableServerWebStorage(name) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);

  if (!descriptor?.configurable) {
    return;
  }

  Object.defineProperty(globalThis, name, {
    configurable: true,
    enumerable: descriptor.enumerable ?? true,
    writable: false,
    value: undefined,
  });
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  // Some client-only packages probe Web Storage during server preload.
  // Replace Node's lazy getters so they do not warn during `next start`.
  disableServerWebStorage("localStorage");
  disableServerWebStorage("sessionStorage");
}
