import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types/access';

interface AuthState {
  address: string | null;
  role: UserRole;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setRole: (role: UserRole) => void;
  connect: (address: string) => void;
  disconnect: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      address: null,
      role: 'patient',
      isConnected: false,
      setAddress: (address) => set({ address }),
      setRole: (role) => set({ role }),
      connect: (address) => set({ address, isConnected: true }),
      disconnect: () => set({ address: null, isConnected: false })
    }),
    {
      name: 'auth-storage'
    }
  )
);
