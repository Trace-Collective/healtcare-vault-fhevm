import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { grantAccess, revokeAccess, getAccessLog, getAllAccessLogs } from '@/services/contract';
import { toast } from 'sonner';

export function useAccessLog(patient: string | null) {
  return useQuery({
    queryKey: ['access', patient],
    queryFn: () => getAccessLog(patient!),
    enabled: !!patient
  });
}

export function useAllAccessLogs() {
  return useQuery({
    queryKey: ['access', 'all'],
    queryFn: () => getAllAccessLogs()
  });
}

export function useGrantAccess() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patient, doctor }: { patient: string; doctor: string }) =>
      grantAccess(patient, doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access'] });
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Access granted successfully');
    },
    onError: () => {
      toast.error('Failed to grant access');
    }
  });
}

export function useRevokeAccess() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patient, doctor }: { patient: string; doctor: string }) =>
      revokeAccess(patient, doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access'] });
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Access revoked successfully');
    },
    onError: () => {
      toast.error('Failed to revoke access');
    }
  });
}
