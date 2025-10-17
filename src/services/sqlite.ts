import initSqlJs, { Database } from 'sql.js';

const DB_STORAGE_KEY = 'hv-sqlite-db';
const SCHEMA_VERSION = 1;

let dbPromise: Promise<Database> | null = null;

const locateFile = (file: string) =>
  `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`;

const uint8FromBase64 = (base64: string) => {
  const binary = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const base64FromUint8 = (buffer: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < buffer.length; i += 1) {
    binary += String.fromCharCode(buffer[i]);
  }
  return typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
};

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const persist = (db: Database) => {
  const storage = getStorage();
  if (!storage) return;
  const data = db.export();
  const base64 = base64FromUint8(data);
  storage.setItem(DB_STORAGE_KEY, base64);
};

const ensureSchema = (db: Database) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const versionStmt = db.prepare(`SELECT value FROM meta WHERE key = 'schema_version'`);
  const hasVersion = versionStmt.step();
  versionStmt.free();

  if (!hasVersion) {
    db.run(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY,
        contract_id INTEGER,
        owner TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        granted_to TEXT,
        payload TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id TEXT PRIMARY KEY,
        patient TEXT NOT NULL,
        doctor TEXT NOT NULL,
        granted_at TEXT NOT NULL,
        revoked_at TEXT,
        status TEXT NOT NULL
      );
    `);

    db.run(
      `INSERT INTO meta(key, value) VALUES ('schema_version', $value)`,
      { $value: String(SCHEMA_VERSION) },
    );
    persist(db);
  }
};

export const getDatabase = async () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      const SQL = await initSqlJs({ locateFile });
      const storage = getStorage();
      const stored = storage?.getItem(DB_STORAGE_KEY) ?? null;
      const db = stored
        ? new SQL.Database(uint8FromBase64(stored))
        : new SQL.Database();
      ensureSchema(db);
      return db;
    })();
  }
  return dbPromise;
};

export const readDatabase = getDatabase;

export const writeDatabase = async <T>(fn: (db: Database) => T | Promise<T>) => {
  const db = await getDatabase();
  const result = await fn(db);
  persist(db);
  return result;
};
