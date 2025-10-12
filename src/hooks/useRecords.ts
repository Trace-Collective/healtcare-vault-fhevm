import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';
import { createRecord, listRecords, getRecord, listAllRecords } from '@/services/contract';
import { HealthRecord } from '@/types/records';

export function useMyRecords(addressOverride?: string | null) {
  const { address } = useAccount();
  const ownerAddress = addressOverride ?? address ?? null;

  return useQuery({
    queryKey: ['records', ownerAddress],
    queryFn: () => listRecords(ownerAddress!),
    enabled: !!ownerAddress
  });
}

export function useAllRecords() {
  return useQuery({
    queryKey: ['records', 'all'],
    queryFn: () => listAllRecords()
  });
}

export function useRecord(id: string | undefined) {
  return useQuery({
    queryKey: ['record', id],
    queryFn: () => getRecord(id!),
    enabled: !!id
  });
}

export function useCreateRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (rec: HealthRecord) => createRecord(rec),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      if (variables.owner) {
        queryClient.invalidateQueries({ queryKey: ['records', variables.owner] });
      }
      toast.success('Record created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create record');
      console.error('Create record error:', error);
    }
  });
}
