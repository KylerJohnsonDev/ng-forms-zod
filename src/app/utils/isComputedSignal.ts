import { Signal } from '@angular/core';

/**
 * Type guard function to check if a given value is an Angular computed signal
 * of a specific type.
 *
 * @param value The value to check.
 * @returns True if the value is a computed signal, false otherwise.
 */
export function isComputedSignal<T>(value: unknown): value is Signal<T> {
  return (
    typeof value === 'function' &&
    Object.getOwnPropertyNames(value).includes('__brand_signal__') &&
    Object.getOwnPropertyNames(value).includes('__ng_computed__')
  );
}
