import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { z, ZodSchema } from 'zod';
import {
  emailSchema,
  passwordSchema,
  useFormControl,
} from './validation';
import { MatIconModule } from '@angular/material/icon';
import { XFormControlHandlerDirective } from './x-form-control-handler.directive';
import { XFormError } from '../../components/form-error';

@Component({
  selector: 'app-login-form',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    XFormControlHandlerDirective,
    XFormError,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Join Us!</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-1">
        <form class="flex flex-col">
          <mat-form-field appearance="outline" [class]="{ 'zod-error': !emailControl.isValid() }">
            <mat-label>Email</mat-label>
            <input
              matInput
              name="email"
              placeholder="Email"
              xFormControlHandler
              [xformControl]="emailControl"
              [(ngModel)]="emailControl.value"
            />
            @if (!emailControl.isValid() && emailControl.errors()) {
              @for (err of emailControl.errors(); track $index) {
                <x-form-error [errorMessage]="err.message" />
              }
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input
              matInput
              name="password"
              xFormControlHandler
              [xformControl]="passwordControl"
              [type]="isPasswordHidden() ? 'password' : 'text'"
              [(ngModel)]="passwordControl.value"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="isPasswordHidden.set(!isPasswordHidden())"
              [attr.aria-label]="'Hide password'"
            >
              <mat-icon>{{
                isPasswordHidden() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (!passwordControl.isValid() && passwordControl.errors()) {
              @for (err of passwordControl.errors(); track $index) {
                <mat-hint class="mat-error">{{ err.message }}</mat-hint>
              }
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Confirm Password</mat-label>
            <input
              matInput
              name="confirmPassword"
              [type]="isConfirmPasswordHidden() ? 'password' : 'text'"
              [(ngModel)]="confirmPasswordControl.value"
              xFormControlHandler
              [xformControl]="confirmPasswordControl"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="isConfirmPasswordHidden.set(!isConfirmPasswordHidden())"
              [attr.aria-label]="'Hide password'"
            >
              <mat-icon>{{
                isConfirmPasswordHidden() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (!confirmPasswordControl.isValid() && confirmPasswordControl.errors()) {
              @for (err of confirmPasswordControl.errors(); track $index) {
                <mat-hint class="mat-error">{{ err.message }}</mat-hint>
              }
            }
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions class="flex justify-center">
          <button mat-flat-button color="primary">Sign Up</button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  `,
  styles: `
    @use '@angular/material' as mat;
    :host {
      padding: 1rem;
      display: block;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      mat-card {
        max-width: 400px;
        width: 100%;
      }
    }

    .zod-error {
      @include mat.form-field-overrides(
        (
          filled-caret-color: var(--mat-sys-error),
          filled-label-text-color: var(--mat-sys-error),
          outlined-outline-color: var(--mat-sys-error)
            // filled-container-color: var(--mat-sys-error-container),
          , // filled-indicator-color: var(--mat-sys-error),
        )
      );
    }
  `,
})
export class LoginFormComponent {
  emailControl = useFormControl<string>({
    defaultValue: '',
    zodSchema: emailSchema,
  });

  passwordControl = useFormControl<string>({
    defaultValue: '',
    zodSchema: passwordSchema,
  });

  // no reactive context in the useFormControl means the zodSchema signal doesn't get updated
  // that's why this isn't working. Instead, consider wrapping useFormControl in a computed
  // add a deps array argument to the useFormControl options that contains the value to validate against
  // and the validation function.
  confirmPasswordControl = useFormControl<string>({
    defaultValue: '',
    zodSchema: computed(() => {
      const schema: ZodSchema<string> = z.string().refine((val) => val === this.passwordControl.value(), {
        message: 'Passwords do not match'
      })
      return schema;
    })
  })

  isPasswordHidden = signal(true);
  isConfirmPasswordHidden = signal(true);
}
