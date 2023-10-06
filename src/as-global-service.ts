declare global {
  // eslint-disable-next-line no-var
  var services: Map<string, any>;
}

global.services ??= new Map();

/**
 * Creates a service and stores it in a global cache. Use this to persist data across hot reloads.
 * @param fn Function that returns a service.
 * @param key Unique key to store the service under.
 * @returns The service.
 */
const asGlobalService = <R>(fn: () => R, key: string): R => {
  if (global.services.has(key)) {
    return global.services.get(key);
  }

  const service = fn();
  global.services.set(key, service);

  return service;
}

export default asGlobalService;
