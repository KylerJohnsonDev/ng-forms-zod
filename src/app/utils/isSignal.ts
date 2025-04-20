import { Signal } from '@angular/core';

/**
 * Type guard function to check if a given value is an Angular signal
 * of a specific type (either a writable signal or a computed signal).
 *
 * @param value The value to check.
 * @returns True if the value is a signal, false otherwise.
 */
export function isSignal<T>(value: unknown): value is Signal<T> {
  return (
    typeof value === 'function' &&
    Object.getOwnPropertyNames(value).includes('__brand_signal__')
  );
}
