import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSectionSchema } from "../domain/section-schemas";
import type { BriefingDraft, BriefingStep, BriefingValue } from "../domain/types";
import { BriefingFieldInput } from "./briefing-field";

export interface BriefingStepFormHandle {
  validate: () => Promise<boolean>;
}

interface BriefingStepFormProps {
  step: BriefingStep;
  draft: BriefingDraft;
  showErrors: boolean;
  onValueChange: (fieldId: string, value: BriefingValue) => void;
  onPendingChange: (fieldId: string, pending: boolean) => void;
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

/**
 * Etapa do briefing gerenciada com React Hook Form e validada com o schema
 * Zod da própria etapa. A pendência declarada pelo cliente dispensa o
 * preenchimento do campo obrigatório correspondente.
 */
export const BriefingStepForm = forwardRef<BriefingStepFormHandle, BriefingStepFormProps>(
  function BriefingStepForm({ step, draft, showErrors, onValueChange, onPendingChange }, ref) {
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
      }),
      [trigger],
    );

    function handleChange(fieldId: string, value: BriefingValue) {
      setValue(toFormName(fieldId), value, { shouldDirty: true, shouldValidate: false });
      onValueChange(fieldId, value);
    }

    function handlePendingChange(fieldId: string, pending: boolean) {
      clearErrors(toFormName(fieldId));
      onPendingChange(fieldId, pending);
    }

    return (
      <fieldset className="mt-5 min-w-0">
        <legend className="sr-only">{step.title}</legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          {step.fields.map((field) => {
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
              />
            );
          })}
        </div>
      </fieldset>
    );
  },
);
