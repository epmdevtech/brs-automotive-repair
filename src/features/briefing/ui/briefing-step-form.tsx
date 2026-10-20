import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Info } from "lucide-react";
import { buildSectionSchema } from "../domain/section-schemas";
import { getHiddenFieldIds } from "../domain/conditional";
import type { CepLookupResult } from "../domain/cep-service";
import type { BriefingDraft, BriefingField, BriefingStep, BriefingValue } from "../domain/types";
import { BriefingFieldInput } from "./briefing-field";

export interface BriefingStepFormHandle {
  validate: () => Promise<boolean>;
  /** Erros de validação da etapa, para o resumo acessível de erros. */
  getErrorSummary: () => { fieldId: string; label: string; message: string }[];
}

interface BriefingStepFormProps {
  step: BriefingStep;
  draft: BriefingDraft;
  showErrors: boolean;
  onValueChange: (fieldId: string, value: BriefingValue) => void;
  onPendingChange: (fieldId: string, pending: boolean) => void;
  onCepResolved?: ((result: CepLookupResult) => void) | undefined;
}

type FormValues = Record<string, string | boolean>;

/**
 * O React Hook Form interpreta "." como separador de caminho aninhado, e os
 * ids do briefing são pontuados (ex.: "empresa.razaoSocial"). Os nomes
 * internos do formulário usam "__" e são traduzidos de volta para o id real
 * na validação, mantendo o contrato persistido intacto.
 */
function toFormName(fieldId: string): string {
  return fieldId.replace(/\./g, "__");
}

const GROUP_LABELS: Record<string, string> = {
  empresa: "Dados da empresa",
  servicos: "Serviços e escopo",
  estrutura: "Estrutura física",
  equipamentos: "Equipamentos",
  equipe: "Equipe",
  processos: "Processos",
  capacidade: "Capacidade",
  qualidade: "Qualidade",
  documentos: "Documentação",
  sistemas: "Sistemas",
  fornecedores: "Fornecedores",
  credenciamento: "Credenciamento",
  fotos: "Acervo de imagens",
  site: "Site institucional",
  confirmacao: "Confirmação",
};

function groupOf(field: BriefingField): string {
  if (field.group) return field.group;
  const prefix = field.id.split(".")[0] ?? "";
  return GROUP_LABELS[prefix] ?? "Informações";
}

/**
 * Etapa do briefing gerenciada com React Hook Form e validada com o schema
 * Zod da própria etapa. A pendência declarada pelo cliente dispensa o
 * preenchimento do campo obrigatório correspondente.
 */
export const BriefingStepForm = forwardRef<BriefingStepFormHandle, BriefingStepFormProps>(
  function BriefingStepForm(
    { step, draft, showErrors, onValueChange, onPendingChange, onCepResolved },
    ref,
  ) {
    const schema = useMemo(
      () => buildSectionSchema(step, draft.pending as Record<string, boolean>),
      [step, draft.pending],
    );
    const schemaRef = useRef(schema);
    schemaRef.current = schema;

    const resolver = useCallback(
      async (values: FormValues, context: unknown, options: unknown) => {
        const flat: FormValues = {};

        for (const field of step.fields) {
          const value = values[toFormName(field.id)];
          if (value !== undefined) flat[field.id] = value;
        }

        const result = schemaRef.current.safeParse(flat);

        if (result.success) {
          return { values: flat, errors: {} };
        }

        const errors: Record<string, { type: string; message: string }> = {};

        for (const issue of result.error.issues) {
          const name = toFormName(String(issue.path[0] ?? ""));
          errors[name] = { type: "validation", message: issue.message };
        }

        void context;
        void options;

        return { values: flat, errors };
      },
      [step.fields],
    );

    const defaultValues = useMemo<FormValues>(() => {
      const values: FormValues = {};
      for (const field of step.fields) {
        const value = draft.values[field.id];
        if (value !== undefined) values[toFormName(field.id)] = value;
      }
      return values;
    }, [draft.values, step.fields]);

    const {
      register,
      unregister,
      reset,
      setValue,
      clearErrors,
      trigger,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: resolver as never,
      defaultValues,
      mode: "onSubmit",
      reValidateMode: "onChange",
    });

    const stepIdRef = useRef(step.id);
    useEffect(() => {
      if (stepIdRef.current !== step.id) {
        stepIdRef.current = step.id;
        reset(defaultValues);
      }
    }, [defaultValues, reset, step.id]);

    useEffect(() => {
      for (const field of step.fields) {
        register(toFormName(field.id));
      }
      return () => {
        for (const field of step.fields) {
          unregister(toFormName(field.id));
        }
      };
    }, [register, step.fields, unregister]);

    useImperativeHandle(
      ref,
      () => ({
        validate: async () => trigger(),
        getErrorSummary: () =>
          Object.entries(errors).map(([formName, error]) => {
            const fieldId = formName.replace(/__/g, ".");
            return {
              fieldId,
              label: step.fields.find((field) => field.id === fieldId)?.label ?? fieldId,
              message: error?.message ?? "Valor inválido",
            };
          }),
      }),
      [errors, step.fields, trigger],
    );

    function handleChange(fieldId: string, value: BriefingValue) {
      setValue(toFormName(fieldId), value, { shouldDirty: true, shouldValidate: false });
      onValueChange(fieldId, value);
    }

    function handlePendingChange(fieldId: string, pending: boolean) {
      clearErrors(toFormName(fieldId));
      onPendingChange(fieldId, pending);
    }

    const hiddenFieldIds = useMemo(
      () => getHiddenFieldIds(step.id, draft.values as Record<string, string | boolean>),
      [draft.values, step.id],
    );

    const visibleFields = useMemo(
      () => step.fields.filter((field) => !hiddenFieldIds.includes(field.id)),
      [hiddenFieldIds, step.fields],
    );

    const discardedFields = useMemo(
      () =>
        hiddenFieldIds
          .filter((fieldId) => {
            const value = draft.values[fieldId];
            return value !== undefined && value !== "";
          })
          .map((fieldId) => step.fields.find((field) => field.id === fieldId)?.label ?? fieldId),
      [draft.values, hiddenFieldIds, step.fields],
    );

    const groups = useMemo(() => {
      const map = new Map<string, BriefingField[]>();
      for (const field of visibleFields) {
        const key = groupOf(field);
        const list = map.get(key) ?? [];
        list.push(field);
        map.set(key, list);
      }
      return [...map.entries()];
    }, [visibleFields]);

    return (
      <div className="mt-5 min-w-0 space-y-6">
        {discardedFields.length > 0 ? (
          <p
            role="status"
            className="flex items-start gap-2 border border-amber-300/30 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-100"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              A resposta anterior em {discardedFields.join(", ")} não será enviada, porque a
              pergunta que a habilita mudou. As informações continuam visíveis se você alterar a
              resposta.
            </span>
          </p>
        ) : null}

        {groups.map(([groupLabel, fields]) => (
          <fieldset key={groupLabel} className="min-w-0">
            <legend className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-neutral-500">
              {groupLabel}
            </legend>
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
              {fields.map((field) => {
                const value = draft.values[field.id];
                const fieldError = errors[toFormName(field.id)];
                return (
                  <BriefingFieldInput
                    key={field.id}
                    field={field}
                    value={value}
                    pending={Boolean(draft.pending[field.id])}
                    showError={showErrors || Boolean(fieldError)}
                    errorMessage={
                      fieldError && typeof fieldError.message === "string"
                        ? fieldError.message
                        : undefined
                    }
                    onChange={(nextValue) => handleChange(field.id, nextValue)}
                    onPendingChange={(pending) => handlePendingChange(field.id, pending)}
                    onCepResolved={onCepResolved}
                  />
                );
              })}
            </div>
          </fieldset>
        ))}

        <p className="flex items-start gap-2 border-t border-white/10 pt-3 text-xs leading-relaxed text-neutral-500">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            Campos com <span className="text-[var(--brand-text-accent)]">*</span> são obrigatórios,
            mas podem ser marcados como pendentes quando a informação não estiver disponível.
            Declarações finais não podem ser marcadas como pendentes.
          </span>
        </p>
      </div>
    );
  },
);
