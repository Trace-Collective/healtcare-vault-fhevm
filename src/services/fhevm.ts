import { bytesToHex } from 'viem';

const RELAYER_SDK_URL =
  'https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs';

let sdkPromise: Promise<RelayerSDK> | null = null;
let instancePromise: Promise<RelayerInstance> | null = null;

const toHex = (value: Uint8Array | string): `0x${string}` =>
  (typeof value === 'string'
    ? value.startsWith('0x')
      ? (value as `0x${string}`)
      : (`0x${value}` as `0x${string}`)
    : bytesToHex(value)) as `0x${string}`;

const ensurePolyfills = (win: Window & typeof globalThis) => {
  const target = win as unknown as {
    global?: typeof globalThis;
    process?: { env: Record<string, string> };
  };

  if (typeof target.global === 'undefined') {
    target.global = win;
  }

  if (typeof target.process === 'undefined') {
    target.process = { env: {} };
  }
};

const loadRelayerScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('FHE relayer SDK requires a browser environment'));
      return;
    }

    if (window.relayerSDK) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RELAYER_SDK_URL}"]`,
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () =>
          reject(
            new Error(
              `Failed to load relayer SDK from ${RELAYER_SDK_URL}`,
            ),
          ),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = RELAYER_SDK_URL;
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () =>
        reject(
          new Error(`Failed to load relayer SDK from ${RELAYER_SDK_URL}`),
        ),
      { once: true },
    );
    document.head.appendChild(script);
  });

const getRelayerSdk = async () => {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      if (typeof window === 'undefined') {
        throw new Error('FHE encryption is only available in the browser');
      }

      ensurePolyfills(window);
      if (!window.relayerSDK) {
        await loadRelayerScript();
      }

      const sdk = window.relayerSDK;
      if (!sdk) {
        throw new Error('Relayer SDK failed to initialise');
      }

      if (!sdk.__initialized__) {
        const ok = await sdk.initSDK({ thread: 0 });
        if (!ok) {
          throw new Error('Relayer SDK initialisation returned false');
        }
        sdk.__initialized__ = true;
      }

      return sdk;
    })();
  }

  return sdkPromise;
};

const resolveFheInstance = async () => {
  const sdk = await getRelayerSdk();
  const provider = (window as any).ethereum;
  if (!provider) {
    throw new Error('No injected EVM provider found');
  }

  const chainIdResult = await provider.request?.({ method: 'eth_chainId' });
  const chainId =
    typeof chainIdResult === 'string'
      ? Number(chainIdResult)
      : Number(chainIdResult);

  if (!Number.isFinite(chainId)) {
    throw new Error('Unable to resolve numeric chain id for FHE instance');
  }

  const relayerUrl =
    import.meta.env.VITE_FHE_GATEWAY_URL || sdk.SepoliaConfig.relayerUrl;

  return sdk.createInstance({
    ...sdk.SepoliaConfig,
    network: provider,
    chainId,
    relayerUrl,
  });
};

export async function getFhe() {
  if (!instancePromise) {
    instancePromise = resolveFheInstance();
  }
  return instancePromise;
}

export async function encryptU16For(
  contract: `0x${string}`,
  value: number,
  account: `0x${string}`,
) {
  const fhe = await getFhe();
  const input = fhe.createEncryptedInput(contract, account);
  input.add16(value);
  let handles;
  let inputProof;
  try {
    ({ handles, inputProof } = await input.encrypt());
  } catch (error) {
    console.error('[FHE] Failed to encrypt uint16', error);
    throw error;
  }

  if (!handles?.[0]) {
    throw new Error('Failed to encrypt value: missing handle');
  }

  return {
    external: toHex(handles[0]),
    proof: toHex(inputProof),
  };
}
