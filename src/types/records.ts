export type EncryptedBlob = string; // base64/hex ciphertext

export type HealthRecord = {
  id: string;
  owner: string; // patient wallet
  grantedTo?: string[]; // doctors with access
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  // Stored encrypted
  payload: {
    complaint: EncryptedBlob;
    diagnosis: EncryptedBlob;
    medications: EncryptedBlob;
    allergy: EncryptedBlob;
    note?: EncryptedBlob;
  };
};

export type DecryptedHealthRecord = Omit<HealthRecord, 'payload'> & {
  payload: {
    complaint: string;
    diagnosis: string;
    medications: string;
    allergy: string;
    note?: string;
  };
};
