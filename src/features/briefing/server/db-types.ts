export interface ProfileRow {
  id: string;
  display_name: string | null;
  role: "client" | "admin";
  created_at: string;
  updated_at: string;
}

export interface BriefingRow {
  id: string;
  company_name: string;
  owner_user_id: string;
  status: "draft" | "submitted" | "in_review" | "awaiting_information" | "completed";
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  completed_at: string | null;
  client_message: string | null;
}

export interface BriefingAnswerRow {
  id: string;
  briefing_id: string;
  section_key: string;
  answers: {
    values?: Record<string, string | boolean>;
    pending?: Record<string, boolean>;
  };
  updated_at: string;
}

export interface BriefingFileRow {
  id: string;
  briefing_id: string;
  uploaded_by: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  category: string;
  created_at: string;
}

export interface BriefingActivityRow {
  id: string;
  briefing_id: string;
  actor_user_id: string | null;
  action: string;
  metadata: Record<string, string | number | boolean | null>;
  created_at: string;
}

export const BRIEFING_ACTIVITY_ACTIONS = [
  "briefing_created",
  "section_saved",
  "submitted",
  "status_changed",
  "information_requested",
  "internal_note",
  "file_uploaded",
  "file_removed",
] as const;

export type BriefingActivityAction = (typeof BRIEFING_ACTIVITY_ACTIONS)[number];
