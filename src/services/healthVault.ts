import { writeContract } from 'wagmi/actions';
import { HEALTH_VAULT } from '@/lib/contract';
import { encryptU16For } from './fhevm';

export async function hvCreateRecordFromExternal(
  cid: string,
  allergyCode: number,
  riskScore: number
) {
  const fn = 'createRecordFromExternal';
  const a = await encryptU16For(HEALTH_VAULT.address, fn, allergyCode);
  const r = await encryptU16For(HEALTH_VAULT.address, fn, riskScore);
  return writeContract({
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: fn,
    args: [cid, a.external, a.proof, r.external, r.proof],
  });
}

export function hvGrantAccess(doctor: `0x${string}`, isGranted: boolean) {
  return writeContract({
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'grantAccess',
    args: [doctor, isGranted],
  });
}

export async function hvAddRiskDelta(id: bigint, delta: number) {
  const fn = 'addRiskDelta';
  const d = await encryptU16For(HEALTH_VAULT.address, fn, delta);
  return writeContract({
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: fn,
    args: [id, d.external],
  });
}

export function hvRequestRiskDecrypt(id: bigint) {
  return writeContract({
    address: HEALTH_VAULT.address,
    abi: HEALTH_VAULT.abi,
    functionName: 'requestRiskDecrypt',
    args: [id],
  });
}
