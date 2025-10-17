import { useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import {
  hvCreateRecordFromExternal,
  hvGrantAccess,
  hvAddRiskDelta,
  hvRequestRiskDecrypt,
} from '@/services/healthVault';

export const useHVCreate = () => {
  const { address } = useAccount();
  const getAccount = () => {
    if (!address) throw new Error('Wallet not connected');
    return address as `0x${string}`;
  };
  return useMutation({
    mutationFn: ({
      cid,
      allergy,
      risk,
    }: {
      cid: string;
      allergy: number;
      risk: number;
    }) => hvCreateRecordFromExternal(cid, allergy, risk, getAccount()),
  });
};

export const useHVGrant = () => {
  const { address } = useAccount();
  const getAccount = () => {
    if (!address) throw new Error('Wallet not connected');
    return address as `0x${string}`;
  };
  return useMutation({
    mutationFn: ({
      doctor,
      isGranted,
    }: {
      doctor: `0x${string}`;
      isGranted: boolean;
    }) => hvGrantAccess(doctor, isGranted, getAccount()),
  });
};

export const useHVAddDelta = () => {
  const { address } = useAccount();
  const getAccount = () => {
    if (!address) throw new Error('Wallet not connected');
    return address as `0x${string}`;
  };
  return useMutation({
    mutationFn: ({
      id,
      delta,
    }: {
      id: bigint;
      delta: number;
    }) => hvAddRiskDelta(id, delta, getAccount()),
  });
};

export const useHVDecrypt = () => {
  const { address } = useAccount();
  const getAccount = () => {
    if (!address) throw new Error('Wallet not connected');
    return address as `0x${string}`;
  };
  return useMutation({
    mutationFn: ({ id }: { id: bigint }) => hvRequestRiskDecrypt(id, getAccount()),
  });
};
