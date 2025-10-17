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
      cid,
      allergy,
      risk,
    }: {
      cid: string;
      allergy: number;
      risk: number;
    }) => hvCreateRecordFromExternal(cid, allergy, risk),
  });

export const useHVGrant = () =>
  useMutation({
    mutationFn: ({
      doctor,
      isGranted,
    }: {
      doctor: `0x${string}`;
      isGranted: boolean;
    }) => hvGrantAccess(doctor, isGranted),
  });

export const useHVAddDelta = () =>
  useMutation({
    mutationFn: ({
      id,
      delta,
    }: {
      id: bigint;
      delta: number;
    }) => hvAddRiskDelta(id, delta),
  });

export const useHVDecrypt = () =>
  useMutation({
    mutationFn: ({ id }: { id: bigint }) => hvRequestRiskDecrypt(id),
  });
