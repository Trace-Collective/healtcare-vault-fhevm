import { initFhevm, createInstance } from 'fhevmjs';

let _inst: any;

export async function getFhe() {
  if (!_inst) {
    await initFhevm();
    _inst = await createInstance({
      network: (window as any).ethereum,
      gatewayUrl: import.meta.env.VITE_FHE_GATEWAY_URL,
    });
  }
  return _inst;
}

export async function encryptU16For(
  contract: `0x${string}`,
  functionName: string,
  value: number
) {
  const fhe = await getFhe();
  const enc = await fhe.encrypt16(value);
  const { external, proof } = await fhe.createEncryptedInput({
    contractAddress: contract,
    functionName,
    value: enc,
    bits: 16,
  });
  return { external, proof };
}
