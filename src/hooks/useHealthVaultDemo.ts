import { useMutation } from '@tanstack/react-query';
import {
  hvCreateRecordFromExternal,
  hvGrantAccess,
  hvAddRiskDelta,
  hvRequestRiskDecrypt,
} from '@/services/healthVault';

export const useHVCreate = () =>
  useMutation({
    mutationFn: ({
      account,
      cid,
      allergy,
      risk,
    }: {
      account: `0x${string}`;
      cid: string;
      allergy: number;
      risk: number;
    }) => hvCreateRecordFromExternal(account, cid, allergy, risk),
  });

export const useHVGrant = () =>
  useMutation({
    mutationFn: ({
      account,
      doctor,
      isGranted,
    }: {
      account: `0x${string}`;
      doctor: `0x${string}`;
      isGranted: boolean;
    }) => hvGrantAccess(account, doctor, isGranted),
  });

export const useHVAddDelta = () =>
  useMutation({
    mutationFn: ({
      account,
      id,
      delta,
    }: {
      account: `0x${string}`;
      id: bigint;
      delta: number;
    }) => hvAddRiskDelta(account, id, delta),
  });

export const useHVDecrypt = () =>
  useMutation({
    mutationFn: ({ account, id }: { account: `0x${string}`; id: bigint }) =>
      hvRequestRiskDecrypt(account, id),
  });
