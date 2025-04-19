import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { z } from 'zod';
import { Email, emailSchema, Password, passwordSchema, useFormControl } from './validation';
import { MatIconModule } from '@angular/material/icon';
import { XFormControlHandlerDirective } from './x-form-control-handler.directive';

@Component({
  selector: 'app-login-form',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    XFormControlHandlerDirective
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Join Us!</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-1">
        <form class="flex flex-col">
          <mat-form-field

            [class]="{ 'zod-error': !emailControl.isValid()}"
          >
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
                <mat-hint class="mat-error">{{ err.message }}</mat-hint>
              }
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput name="password" [type]="isPasswordHidden() ? 'password' : 'text'" [(ngModel)]="password" />
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
            @if (passwordFormState().errors) {
              @for (err of passwordFormState().errors; track err.code) {
                <mat-hint class="mat-error">{{ err.message }}</mat-hint>
              }
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Confirm Password</mat-label>
            <input matInput name="confirmPassword" [type]="isConfirmPasswordHidden() ? 'password' : 'text'" [(ngModel)]="confirmPassword"/>
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
            @if (confirmPasswordFormState().errors) {
              @for (err of confirmPasswordFormState().errors; track err.code) {
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
      @include mat.form-field-overrides((
        filled-caret-color: var(--mat-sys-error),
        filled-label-text-color: var(--mat-sys-error),
        outlined-outline-color: var(--mat-sys-error)
        // filled-container-color: var(--mat-sys-error-container),
        // filled-indicator-color: var(--mat-sys-error),
      ));
    }
  `,
})
export class LoginFormComponent {
  // email = signal<Email>('');
  // emailFormState = computed(() => {
  //   const { success, error } = emailSchema.safeParse(this.email());
  //   return {
  //     isValid: success,
  //     errors: error?.errors ?? null,
  //   };
  // });
  emailControl = useFormControl<string>({
    defaultValue: '',
    zodSchema: emailSchema,
  });

  password = signal<Password>('');
  passwordFormState = computed(() => {
    const { success, error } = passwordSchema.safeParse(this.password());
    return {
      isValid: success,
      errors: error?.errors ?? null,
    };
  });

  confirmPassword = signal<Password>('');
  confirmPasswordFormState = computed(() => {
    const { success, error } = passwordSchema
      .refine((val) => val === this.confirmPassword(), {
        message: 'Passwords do not match!',
      })
      .safeParse(this.confirmPassword());
    return {
      isValid: success,
      errors: error?.errors ?? null,
    };
  });

  isPasswordHidden = signal(true);
  isConfirmPasswordHidden = signal(true);
}
