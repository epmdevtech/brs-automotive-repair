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
      async (values: FormValues, context: unknown, options: unknown) =>
        (
          zodResolver as unknown as (
            schema: unknown,
          ) => (values: FormValues, context: unknown, options: unknown) => Promise<never>
        )(schemaRef.current)(values, context, options),
      [],
    );

    const defaultValues = useMemo<FormValues>(() => {
      const values: FormValues = {};
      for (const field of step.fields) {
        const value = draft.values[field.id];
        if (value !== undefined) values[field.id] = value;
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
        register(field.id);
      }
      return () => {
        for (const field of step.fields) {
          unregister(field.id);
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
      setValue(fieldId, value, { shouldDirty: true, shouldValidate: false });
      onValueChange(fieldId, value);
    }

    function handlePendingChange(fieldId: string, pending: boolean) {
      clearErrors(fieldId);
      onPendingChange(fieldId, pending);
    }

    return (
      <fieldset className="mt-5 min-w-0">
        <legend className="sr-only">{step.title}</legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          {step.fields.map((field) => {
            const value = draft.values[field.id];
            const fieldError = errors[field.id];
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
