export type AccessGrant = {
  id: string;
  patient: string;
  doctor: string;
  grantedAt: string;
  revokedAt?: string;
  status: "granted" | "revoked" | "pending";
};

export type UserRole = "patient" | "doctor" | "admin";

export type User = {
  address: string;
  role: UserRole;
  name?: string;
};
