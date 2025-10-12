export const translations = {
  id: {
    common: {
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      success: 'Berhasil',
      cancel: 'Batal',
      save: 'Simpan',
      delete: 'Hapus',
      edit: 'Edit',
      view: 'Lihat',
      create: 'Buat',
      search: 'Cari...',
      noData: 'Tidak ada data'
    },
    nav: {
      dashboard: 'Dashboard',
      records: 'Rekam Medis',
      access: 'Kelola Akses',
      settings: 'Pengaturan'
    },
    landing: {
      title: 'Rekam Medis Terenkripsi dengan FHE',
      subtitle: 'Kelola data kesehatan Anda dengan aman menggunakan enkripsi homomorfik penuh di blockchain',
      connectWallet: 'Hubungkan Wallet',
      openDashboard: 'Buka Dashboard',
      features: {
        privacy: {
          title: 'Privasi Penuh',
          desc: 'Data terenkripsi end-to-end dengan FHE'
        },
        control: {
          title: 'Kontrol Akses',
          desc: 'Anda yang menentukan siapa dapat melihat data'
        },
        blockchain: {
          title: 'Blockchain',
          desc: 'Transparan dan tidak dapat diubah'
        }
      }
    },
    dashboard: {
      welcome: 'Selamat Datang',
      totalRecords: 'Total Rekam Medis',
      activeAccess: 'Akses Aktif',
      createRecord: 'Buat Rekam Medis',
      manageAccess: 'Kelola Akses'
    },
    records: {
      title: 'Rekam Medis Saya',
      newRecord: 'Rekam Medis Baru',
      complaint: 'Keluhan',
      diagnosis: 'Diagnosa',
      medications: 'Obat-obatan',
      allergy: 'Alergi',
      note: 'Catatan',
      createdAt: 'Dibuat pada',
      accessGranted: 'Akses Diberikan',
      noAccess: 'Tidak Ada Akses',
      encrypted: 'Terenkripsi',
      decrypted: 'Terdekripsi',
      demoMode: 'Mode Demo - Enkripsi FHE Placeholder'
    },
    access: {
      title: 'Kelola Akses',
      grantAccess: 'Berikan Akses',
      revokeAccess: 'Cabut Akses',
      doctorAddress: 'Alamat Dokter',
      granted: 'Diberikan',
      revoked: 'Dicabut',
      pending: 'Menunggu',
      logs: 'Log Akses'
    },
    settings: {
      title: 'Pengaturan',
      language: 'Bahasa',
      theme: 'Tema',
      light: 'Terang',
      dark: 'Gelap',
      profile: 'Profil'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      create: 'Create',
      search: 'Search...',
      noData: 'No data available'
    },
    nav: {
      dashboard: 'Dashboard',
      records: 'Health Records',
      access: 'Access Control',
      settings: 'Settings'
    },
    landing: {
      title: 'Encrypted Health Records with FHE',
      subtitle: 'Manage your health data securely using fully homomorphic encryption on blockchain',
      connectWallet: 'Connect Wallet',
      openDashboard: 'Open Dashboard',
      features: {
        privacy: {
          title: 'Full Privacy',
          desc: 'End-to-end encrypted data with FHE'
        },
        control: {
          title: 'Access Control',
          desc: 'You decide who can view your data'
        },
        blockchain: {
          title: 'Blockchain',
          desc: 'Transparent and immutable'
        }
      }
    },
    dashboard: {
      welcome: 'Welcome',
      totalRecords: 'Total Records',
      activeAccess: 'Active Access',
      createRecord: 'Create Record',
      manageAccess: 'Manage Access'
    },
    records: {
      title: 'My Health Records',
      newRecord: 'New Health Record',
      complaint: 'Complaint',
      diagnosis: 'Diagnosis',
      medications: 'Medications',
      allergy: 'Allergy',
      note: 'Note',
      createdAt: 'Created at',
      accessGranted: 'Access Granted',
      noAccess: 'No Access',
      encrypted: 'Encrypted',
      decrypted: 'Decrypted',
      demoMode: 'Demo Mode - FHE Encryption Placeholder'
    },
    access: {
      title: 'Access Control',
      grantAccess: 'Grant Access',
      revokeAccess: 'Revoke Access',
      doctorAddress: 'Doctor Address',
      granted: 'Granted',
      revoked: 'Revoked',
      pending: 'Pending',
      logs: 'Access Logs'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      profile: 'Profile'
    }
  }
};

export type Language = 'id' | 'en';

export function t(key: string, lang: Language = 'id'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }
  
  return value;
}
