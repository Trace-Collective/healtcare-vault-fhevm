/**
 * Smart Contract Service (Mock)
 * TODO: Replace with actual FHEVM contract calls
 */

import { HealthRecord } from "@/types/records";
import { AccessGrant } from "@/types/access";

// In-memory database for demo
let MEMORY_DB: HealthRecord[] = [];
let ACCESS_DB: AccessGrant[] = [];

// Initialize with sample data
export function initializeSampleData() {
  const sampleDate = new Date().toISOString();
  
  if (MEMORY_DB.length === 0) {
    MEMORY_DB = [
      {
        id: "sample-1",
        owner: "0x1234...5678",
        createdAt: sampleDate,
        grantedTo: ["0xabcd...ef01"],
        payload: {
          complaint: btoa(JSON.stringify("Demam dan batuk selama 3 hari")),
          diagnosis: btoa(JSON.stringify("Influenza")),
          medications: btoa(JSON.stringify("Paracetamol 500mg, 3x sehari")),
          allergy: btoa(JSON.stringify("Tidak ada")),
          note: btoa(JSON.stringify("Istirahat cukup dan minum air putih"))
        }
      }
    ];
  }
}

export async function listRecords(address: string | null): Promise<HealthRecord[]> {
  // TODO: Replace with readContract to FHEVM
  if (!address) return [];
  
  initializeSampleData();
  
  return MEMORY_DB.filter(
    (r) => r.owner.toLowerCase() === address.toLowerCase()
  );
}

export async function listAllRecords(): Promise<HealthRecord[]> {
  initializeSampleData();
  return MEMORY_DB;
}

export async function createRecord(rec: HealthRecord): Promise<HealthRecord> {
  // TODO: Replace with writeContract to FHEVM
  MEMORY_DB.unshift(rec);
  return rec;
}

export async function getRecord(id: string): Promise<HealthRecord | null> {
  initializeSampleData();
  return MEMORY_DB.find((r) => r.id === id) ?? null;
}

export async function grantAccess(patient: string, doctor: string): Promise<void> {
  // TODO: Call contract grantAccess
  MEMORY_DB = MEMORY_DB.map((r) =>
    r.owner === patient
      ? {
          ...r,
          grantedTo: Array.from(new Set([...(r.grantedTo ?? []), doctor]))
        }
      : r
  );
  
  // Add to access log
  ACCESS_DB.push({
    id: `access-${Date.now()}`,
    patient,
    doctor,
    grantedAt: new Date().toISOString(),
    status: "granted"
  });
}

export async function revokeAccess(patient: string, doctor: string): Promise<void> {
  // TODO: Call contract revokeAccess
  MEMORY_DB = MEMORY_DB.map((r) =>
    r.owner === patient
      ? {
          ...r,
          grantedTo: (r.grantedTo ?? []).filter((d) => d !== doctor)
        }
      : r
  );
  
  // Update access log
  ACCESS_DB = ACCESS_DB.map((a) =>
    a.patient === patient && a.doctor === doctor && a.status === "granted"
      ? { ...a, status: "revoked" as const, revokedAt: new Date().toISOString() }
      : a
  );
}

export async function getAccessLog(patient: string): Promise<AccessGrant[]> {
  return ACCESS_DB.filter((a) => a.patient === patient);
}

export async function getAllAccessLogs(): Promise<AccessGrant[]> {
  return ACCESS_DB;
}
