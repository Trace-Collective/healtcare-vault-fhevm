/**
 * Smart Contract Service (Mock)
 * TODO: Replace with actual FHEVM contract calls
 *
 * Backed by a lightweight SQLite (sql.js) database so that demo data persists across reloads.
 */

import { AccessGrant } from '@/types/access';
import { HealthRecord } from '@/types/records';
import { readDatabase, writeDatabase } from './sqlite';

const base64Encode = (input: string) => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  }

  const globalBuffer = (globalThis as any).Buffer as
    | undefined
    | { from: (input: string, encoding: string) => { toString: (enc: string) => string } };
  if (globalBuffer) {
    return globalBuffer.from(input, 'utf-8').toString('base64');
  }

  return input;
};

const toBase64 = (value: string) => base64Encode(JSON.stringify(value));

const parseRecordRow = (row: Record<string, unknown>): HealthRecord => ({
  id: String(row.id),
  contractId: row.contract_id !== null && row.contract_id !== undefined
    ? Number(row.contract_id)
    : undefined,
  owner: String(row.owner),
  createdAt: String(row.created_at),
  updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  grantedTo: row.granted_to ? JSON.parse(String(row.granted_to)) : [],
  payload: JSON.parse(String(row.payload)),
});

const parseAccessRow = (row: Record<string, unknown>): AccessGrant => ({
  id: String(row.id),
  patient: String(row.patient),
  doctor: String(row.doctor),
  grantedAt: String(row.granted_at),
  revokedAt: row.revoked_at ? String(row.revoked_at) : undefined,
  status: row.status as AccessGrant['status'],
});

const ensureSampleData = async () => {
  const db = await readDatabase();
  const countStmt = db.prepare('SELECT COUNT(*) as total FROM records');
  const hasRecords = countStmt.step() ? Number(countStmt.getAsObject().total) > 0 : false;
  countStmt.free();
  if (hasRecords) {
    return;
  }

  await writeDatabase((database) => {
    const sampleDate = new Date().toISOString();
    database.run(
      `
        INSERT INTO records (id, contract_id, owner, created_at, granted_to, payload)
        VALUES ($id, $contractId, $owner, $createdAt, $grantedTo, $payload)
      `,
      {
        $id: 'sample-1',
        $contractId: 1,
        $owner: '0x1234...5678',
        $createdAt: sampleDate,
        $grantedTo: JSON.stringify(['0xabcd...ef01']),
        $payload: JSON.stringify({
          complaint: toBase64('Demam dan batuk selama 3 hari'),
          diagnosis: toBase64('Influenza'),
          medications: toBase64('Paracetamol 500mg, 3x sehari'),
          allergy: toBase64('Tidak ada'),
          note: toBase64('Istirahat cukup dan minum air putih'),
        }),
      },
    );
  });
};

const fetchRecords = async (query: string, params: Record<string, unknown> = {}) => {
  await ensureSampleData();
  const db = await readDatabase();
  const stmt = db.prepare(query, params);
  const rows: HealthRecord[] = [];
  while (stmt.step()) {
    rows.push(parseRecordRow(stmt.getAsObject()));
  }
  stmt.free();
  return rows;
};

export async function listRecords(address: string | null): Promise<HealthRecord[]> {
  if (!address) return [];
  return fetchRecords(
    `
      SELECT * FROM records
      WHERE LOWER(owner) = LOWER($owner)
      ORDER BY datetime(created_at) DESC
    `,
    { $owner: address },
  );
}

export async function listAllRecords(): Promise<HealthRecord[]> {
  return fetchRecords(`
    SELECT * FROM records
    ORDER BY datetime(created_at) DESC
  `);
}

export async function createRecord(rec: HealthRecord): Promise<HealthRecord> {
  const createdAt = rec.createdAt ?? new Date().toISOString();
  const grantedTo = rec.grantedTo ?? [];
  const payloadJson = JSON.stringify(rec.payload);

  return writeDatabase((db) => {
    const maxStmt = db.prepare('SELECT COALESCE(MAX(contract_id), 0) as maxId FROM records');
    const nextContractId = maxStmt.step() ? Number(maxStmt.getAsObject().maxId) + 1 : 1;
    maxStmt.free();

    db.run(
      `
        INSERT INTO records (id, contract_id, owner, created_at, granted_to, payload)
        VALUES ($id, $contractId, $owner, $createdAt, $grantedTo, $payload)
      `,
      {
        $id: rec.id,
        $contractId: nextContractId,
        $owner: rec.owner,
        $createdAt: createdAt,
        $grantedTo: JSON.stringify(grantedTo),
        $payload: payloadJson,
      },
    );

    const select = db.prepare('SELECT * FROM records WHERE id = $id', { $id: rec.id });
    select.step();
    const inserted = parseRecordRow(select.getAsObject());
    select.free();
    return inserted;
  });
}

export async function getRecord(id: string): Promise<HealthRecord | null> {
  const records = await fetchRecords(
    `
      SELECT * FROM records
      WHERE id = $id
      LIMIT 1
    `,
    { $id: id },
  );
  return records[0] ?? null;
}

export async function grantAccess(patient: string, doctor: string): Promise<void> {
  await writeDatabase((db) => {
    const recordStmt = db.prepare(
      `
        SELECT id, granted_to FROM records
        WHERE LOWER(owner) = LOWER($owner)
      `,
      { $owner: patient },
    );

    const updates: { id: string; grantedTo: string[] }[] = [];
    while (recordStmt.step()) {
      const row = recordStmt.getAsObject();
      const current = row.granted_to ? JSON.parse(String(row.granted_to)) : [];
      if (!current.includes(doctor)) {
        updates.push({ id: String(row.id), grantedTo: [...current, doctor] });
      }
    }
    recordStmt.free();

    const updateStmt = db.prepare(
      `
        UPDATE records
        SET granted_to = $grantedTo
        WHERE id = $id
      `,
    );
    updates.forEach(({ id, grantedTo }) => {
      updateStmt.run({ $id: id, $grantedTo: JSON.stringify(grantedTo) });
    });
    updateStmt.free();

    db.run(
      `
        INSERT INTO access_logs (id, patient, doctor, granted_at, status)
        VALUES ($id, $patient, $doctor, $grantedAt, 'granted')
      `,
      {
        $id: `access-${Date.now()}`,
        $patient: patient,
        $doctor: doctor,
        $grantedAt: new Date().toISOString(),
      },
    );
  });
}

export async function revokeAccess(patient: string, doctor: string): Promise<void> {
  await writeDatabase((db) => {
    const recordStmt = db.prepare(
      `
        SELECT id, granted_to FROM records
        WHERE LOWER(owner) = LOWER($owner)
      `,
      { $owner: patient },
    );

    const updates: { id: string; grantedTo: string[] }[] = [];
    while (recordStmt.step()) {
      const row = recordStmt.getAsObject();
      const current = row.granted_to ? JSON.parse(String(row.granted_to)) : [];
      if (current.includes(doctor)) {
        updates.push({
          id: String(row.id),
          grantedTo: current.filter((d: string) => d !== doctor),
        });
      }
    }
    recordStmt.free();

    const updateStmt = db.prepare(
      `
        UPDATE records
        SET granted_to = $grantedTo
        WHERE id = $id
      `,
    );
    updates.forEach(({ id, grantedTo }) => {
      updateStmt.run({ $id: id, $grantedTo: JSON.stringify(grantedTo) });
    });
    updateStmt.free();

    db.run(
      `
        UPDATE access_logs
        SET status = 'revoked', revoked_at = $revokedAt
        WHERE patient = $patient AND doctor = $doctor AND status = 'granted'
      `,
      {
        $patient: patient,
        $doctor: doctor,
        $revokedAt: new Date().toISOString(),
      },
    );
  });
}

export async function getAccessLog(patient: string): Promise<AccessGrant[]> {
  const db = await readDatabase();
  const stmt = db.prepare(
    `
      SELECT * FROM access_logs
      WHERE patient = $patient
      ORDER BY datetime(granted_at) DESC
    `,
    { $patient: patient },
  );
  const rows: AccessGrant[] = [];
  while (stmt.step()) {
    rows.push(parseAccessRow(stmt.getAsObject()));
  }
  stmt.free();
  return rows;
}

export async function getAllAccessLogs(): Promise<AccessGrant[]> {
  const db = await readDatabase();
  const stmt = db.prepare(
    `
      SELECT * FROM access_logs
      ORDER BY datetime(granted_at) DESC
    `,
  );
  const rows: AccessGrant[] = [];
  while (stmt.step()) {
    rows.push(parseAccessRow(stmt.getAsObject()));
  }
  stmt.free();
  return rows;
}
