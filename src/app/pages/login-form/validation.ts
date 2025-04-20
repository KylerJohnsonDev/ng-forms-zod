import { computed, effect, inject, Injector, linkedSignal, runInInjectionContext, Signal, signal, WritableSignal } from '@angular/core';
import { z, ZodIssue, ZodSchema } from 'zod';
import { isSignal } from '../../utils/isSignal';

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
  zodSchema?: ZodSchema | Signal<ZodSchema>
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
  const _zodSchema = options.zodSchema
    ? isSignal<ZodSchema>(options.zodSchema) ? options.zodSchema : signal<ZodSchema>(options.zodSchema)
    : null;
  const isValid = computed(() => {
    // if no zod schema is provided, assume always valid
    if (!_zodSchema) return true;
    // don't validate until the user has focused on field and then navigates away
    if (!touched()) return true;

    const { success } = _zodSchema().safeParse(value());
    return success;
  })
  const errors = computed(() => {
    if (!_zodSchema) return null;
    const { success, error } = _zodSchema().safeParse(value());
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
