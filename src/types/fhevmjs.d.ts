declare module 'fhevmjs' {
  export function initFhevm(): Promise<void>;
  export function createInstance(options: {
    network?: unknown;
    gatewayUrl?: string;
  }): Promise<any>;
}
