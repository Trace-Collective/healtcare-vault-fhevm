import ABI from './abi/HealthVault.json';

export const HEALTH_VAULT = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`,
  abi: (ABI as any).abi,
};
