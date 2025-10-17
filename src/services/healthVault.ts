import { writeContract } from 'wagmi/actions';
import { wagmiConfig } from '@/lib/wagmi';
import { HEALTH_VAULT } from '@/lib/contract';
import { encryptU16For } from './fhevm';

export async function hvCreateRecordFromExternal(
  account: `0x${string}`,
  cid: string,
  allergyCode: number,
  riskScore: number
) {
  const fn = 'createRecordFromExternal';
  const a = await encryptU16For(HEALTH_VAULT.address, fn, allergyCode);
  const r = await encryptU16For(HEALTH_VAULT.address, fn, riskScore);
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: fn,
    account,
    args: [cid, a.external, a.proof, r.external, r.proof],
  });
}

export function hvGrantAccess(account: `0x${string}`, doctor: `0x${string}`, isGranted: boolean) {
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'grantAccess',
    account,
    args: [doctor, isGranted],
  });
}

export async function hvAddRiskDelta(account: `0x${string}`, id: bigint, delta: number) {
  const fn = 'addRiskDelta';
  const d = await encryptU16For(HEALTH_VAULT.address, fn, delta);
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: fn,
    account,
    args: [id, d.external],
  });
}

export function hvRequestRiskDecrypt(account: `0x${string}`, id: bigint) {
  return writeContract(wagmiConfig, {
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'requestRiskDecrypt',
    account,
    args: [id],
  });
}
