type HexString = `0x${string}`;

interface RelayerEncryptedInput {
  add16(value: number | bigint): void;
  encrypt(): Promise<{
    handles: Array<Uint8Array | HexString>;
    inputProof: Uint8Array | HexString;
  }>;
}

interface RelayerInstance {
  createEncryptedInput(contractAddress: HexString, userAddress: HexString): RelayerEncryptedInput;
}

interface RelayerConfig {
  aclContractAddress: HexString;
  kmsContractAddress: HexString;
  inputVerifierContractAddress: HexString;
  verifyingContractAddressDecryption: HexString;
  verifyingContractAddressInputVerification: HexString;
  relayerUrl: string;
  gatewayChainId: number;
  chainId?: number;
  network?: unknown;
  publicKey?: unknown;
  publicParams?: unknown;
}

interface RelayerSDK {
  SepoliaConfig: RelayerConfig;
  initSDK(options?: { thread?: number }): Promise<boolean>;
  createInstance(config: RelayerConfig & { network: unknown; chainId: number; relayerUrl: string }): Promise<RelayerInstance>;
  __initialized__?: boolean;
}

declare global {
  interface Window {
    relayerSDK?: RelayerSDK;
  }
}
