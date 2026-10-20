/**
 * Papéis e permissões do briefing.
 *
 * O papel é lido do banco (`profiles.role`) a partir da sessão do servidor;
 * nunca de um parâmetro enviado pelo navegador.
 */
export const BRIEFING_ROLES = ["client", "admin"] as const;

export type BriefingRole = (typeof BRIEFING_ROLES)[number];

export function isBriefingRole(value: unknown): value is BriefingRole {
  return typeof value === "string" && (BRIEFING_ROLES as readonly string[]).includes(value);
}

export const PERMISSIONS = {
  readOwnBriefing: "read_own_briefing",
  writeOwnDraft: "write_own_draft",
  submitOwnBriefing: "submit_own_briefing",
  uploadOwnFiles: "upload_own_files",
  listAllBriefings: "list_all_briefings",
  readAnyBriefing: "read_any_briefing",
  changeStatus: "change_status",
  readActivity: "read_activity",
  readInternalNotes: "read_internal_notes",
} as const;

export type BriefingPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<BriefingRole, readonly BriefingPermission[]> = {
  client: [
    PERMISSIONS.readOwnBriefing,
    PERMISSIONS.writeOwnDraft,
    PERMISSIONS.submitOwnBriefing,
    PERMISSIONS.uploadOwnFiles,
  ],
  admin: [
    PERMISSIONS.readOwnBriefing,
    PERMISSIONS.writeOwnDraft,
    PERMISSIONS.submitOwnBriefing,
    PERMISSIONS.uploadOwnFiles,
    PERMISSIONS.listAllBriefings,
    PERMISSIONS.readAnyBriefing,
    PERMISSIONS.changeStatus,
    PERMISSIONS.readActivity,
    PERMISSIONS.readInternalNotes,
  ],
};

export function hasPermission(role: BriefingRole, permission: BriefingPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function requirePermission(role: BriefingRole, permission: BriefingPermission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Operação não permitida para o papel ${role}: ${permission}`);
  }
}

export function isOwner(ownerUserId: string, userId: string): boolean {
  return ownerUserId === userId;
}
