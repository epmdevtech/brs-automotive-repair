export type BriefingFieldType =
  "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | "checkbox";

/** Formato canônico do valor, usado pelas máscaras e validadores do domínio. */
export type BriefingFieldFormat =
  "cep" | "cnpj" | "phone" | "date" | "integer" | "decimal" | "email";

export interface BriefingFieldOption {
  value: string;
  label: string;
}

export interface BriefingField {
  id: string;
  label: string;
  type: BriefingFieldType;
  /** Formato canônico aplicado pela máscara e pelo validador do domínio. */
  format?: BriefingFieldFormat;
  /** Agrupamento visual por assunto dentro da etapa. */
  group?: string;
  /** Estilo do controle de seleção (radio group em telas cheia). */
  control?: "select" | "radio";
  required?: boolean;
  allowPending?: boolean;
  placeholder?: string;
  help?: string;
  options?: BriefingFieldOption[];
  rows?: number;
  span?: 1 | 2;
  maxLength?: number;
  min?: number;
  max?: number;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email";
}

export interface BriefingStep {
  id: string;
  number: number;
  title: string;
  shortLabel: string;
  description: string;
  kind: "fields" | "photos";
  fields: BriefingField[];
}

export type BriefingValue = string | boolean;

export interface BriefingPhoto {
  id: string;
  categoryId: string;
  categoryLabel: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  description: string;
  authorized: boolean;
  identifiable: boolean;
}

export interface BriefingDraft {
  schemaVersion: "1.0";
  updatedAt: string;
  values: Record<string, BriefingValue>;
  pending: Record<string, boolean>;
  photos: BriefingPhoto[];
  completed: boolean;
}

export interface BriefingPhotoCategory {
  id: string;
  label: string;
  help?: string;
}

export interface PendingItem {
  stepNumber: number;
  stepTitle: string;
  fieldId: string;
  label: string;
}

export interface BriefingAnswer {
  fieldId: string;
  label: string;
  value: string;
  pending: boolean;
}

export interface BriefingExportSection {
  id: string;
  number: number;
  title: string;
  answers: BriefingAnswer[];
}

export interface BriefingExport {
  schemaVersion: "1.0";
  kind: "briefing-operacional-master";
  generatedAt: string;
  status: "rascunho" | "concluido_localmente";
  company: {
    name: string;
    legalName: string;
    cnpj: string;
  };
  sections: BriefingExportSection[];
  pending: PendingItem[];
  photos: BriefingPhoto[];
  disclaimers: string[];
}
