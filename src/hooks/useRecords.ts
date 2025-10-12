import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRecord, listRecords, getRecord, listAllRecords } from '@/services/contract';
import { HealthRecord } from '@/types/records';
import { toast } from 'sonner';

export function useMyRecords(address: string | null) {
  return useQuery({
    queryKey: ['records', address],
    queryFn: () => listRecords(address),
    enabled: !!address
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Record created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create record');
      console.error('Create record error:', error);
    }
  });
}
