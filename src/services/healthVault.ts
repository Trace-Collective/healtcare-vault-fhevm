import { writeContract } from 'wagmi/actions';
import { HEALTH_VAULT } from '@/lib/contract';
import { wagmiConfig } from '@/lib/wagmi';
import { encryptU16For } from './fhevm';

export async function hvCreateRecordFromExternal(
  cid: string,
  allergyCode: number,
  riskScore: number,
  account?: `0x${string}`,
) {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  const a = await encryptU16For(HEALTH_VAULT.address, allergyCode, account);
  const r = await encryptU16For(HEALTH_VAULT.address, riskScore, account);
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'createRecordFromExternal',
    args: [cid, a.external, a.proof, r.external, r.proof],
    account,
  });
}

export function hvGrantAccess(
  doctor: `0x${string}`,
  isGranted: boolean,
  account?: `0x${string}`,
) {
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'grantAccess',
    args: [doctor, isGranted],
    account,
  });
}

export async function hvAddRiskDelta(
  id: bigint,
  delta: number,
  account?: `0x${string}`,
) {
  if (!account) {
    throw new Error('Wallet not connected');
  }
  const d = await encryptU16For(HEALTH_VAULT.address, delta, account);
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'addRiskDelta',
    args: [id, d.external],
    account,
  });
}

export function hvRequestRiskDecrypt(id: bigint, account?: `0x${string}`) {
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'requestRiskDecrypt',
    args: [id],
    account,
  });
}
