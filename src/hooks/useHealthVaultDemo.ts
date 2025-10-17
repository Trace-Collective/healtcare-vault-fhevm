import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { watchContractEvent } from 'wagmi/actions';
import {
  hvCreateRecordFromExternal,
  hvGrantAccess,
  hvAddRiskDelta,
  hvRequestRiskDecrypt,
} from '@/services/healthVault';
import { HEALTH_VAULT } from '@/lib/contract';
import { wagmiConfig } from '@/lib/wagmi';
import { toast } from '@/hooks/use-toast';

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

export const useWatchRiskDecrypted = () => {
  useEffect(() => {
    const unwatch = watchContractEvent(
      wagmiConfig,
      {
        address: HEALTH_VAULT.address,
        abi: HEALTH_VAULT.abi,
        eventName: 'RiskDecrypted',
      },
      (logs) => {
        logs.forEach((log) => {
          const { args } = log;
          console.log('✅ Risk decrypted:', args);
          const plainRisk = args?.plainRisk;
          toast({
            title: 'Risk decrypted',
            description:
              plainRisk !== undefined ? `Risk score decrypted: ${plainRisk}` : 'Risk score decrypted.',
          });
        });
      },
    );

    return () => {
      unwatch?.();
    };
  }, []);
};
