import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-form',
  imports: [MatCardModule, MatButtonModule, MatInputModule, FormsModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-1">
        <form class="flex flex-col">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput placeholder="Email" required>
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input matInput type="password" placeholder="Password" required>
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-footer>
        <mat-card-actions class="flex justify-center">
          <button mat-flat-button color="primary">Login</button>
        </mat-card-actions>
      </mat-card-footer>
    </mat-card>
  `,
  styles: `
    :host {
      padding: 1rem;
      display: block;
    }
  `
})
export class LoginFormComponent {

}
