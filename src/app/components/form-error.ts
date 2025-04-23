import { Component, input } from '@angular/core';

@Component({
  selector: 'x-form-error',
  template: `
    <span>{{ errorMessage() }}</span>
  `,
  styles: `
    :host {
      background: var(--mat-sys-error);
      color: var(--mat-sys-error-container);
      padding: 0.5rem;
      border-radius: .25rem;
      display: inline-block;
    }
  `
})

export class XFormError {
  errorMessage = input.required<string>();
}
