import { computed, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { z, ZodIssue, ZodSchema } from 'zod';

export const emailSchema = z.string().email()
export const passwordSchema = z.string()
  .min(8, {
    message: 'Password must be at least 8 characters'
  })
  .max(255, {
    message: 'Password cannot exceed 255 characters'
  })

export type Email = z.infer<typeof emailSchema>

export type Password = z.infer<typeof passwordSchema>

export interface UseFormItemOptions<T> {
  defaultValue: T,
  zodSchema?: ZodSchema
}

export interface XFormControl<T>{
  value: WritableSignal<T>,
  isValid: Signal<boolean>,
  errors: Signal<ZodIssue[] | null>,
  touched: WritableSignal<boolean>
  dirty: WritableSignal<boolean>
  disabled: WritableSignal<boolean>
  focused: WritableSignal<boolean>
  pristine: WritableSignal<boolean>
}

export function useFormControl<T> (options: UseFormItemOptions<T>): XFormControl<T> {
  const value = signal<T>(options.defaultValue);
  const focused = signal(false);
  const pristine = signal(true);
  const isValid = computed(() => {
    // if no zod schema is provided, assume always valid
    if (!options.zodSchema) return true;
    // don't validate until the user
    if (!touched()) return true;

    const { success } = options.zodSchema.safeParse(value());
    return success;
  })
  const errors = computed(() => {
    if (!options.zodSchema) return null;
    const { success, error } = options.zodSchema.safeParse(value());
    if (success) return null;
    return error.issues;
  })
  const touched = signal(false);
  const dirty = linkedSignal<T, boolean>({
    source: value,
    computation: (newValue, previousValue) => {
      if(!previousValue) return false;
      if (newValue === previousValue) {
        return false;
      }
      return true;
    }
  })
  const disabled = signal(false);
  return {
    value,
    isValid,
    errors,
    touched,
    dirty,
    disabled,
    focused,
    pristine
  } satisfies XFormControl<T>

}
