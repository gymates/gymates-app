import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog">
      <mat-icon class="dialog__icon">check_circle</mat-icon>
      <h2 mat-dialog-title i18n="@@register.success.title">Account created!</h2>
      <mat-dialog-content>
        <p i18n="@@register.success.message">Your account has been created successfully. You can now log in.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="primary" (click)="close()" i18n="@@register.success.cta">Go to Login</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    .dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 8px 0;

      &__icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #4caf50;
        margin-bottom: 8px;
      }
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterSuccessDialogComponent {
  constructor(private dialogRef: MatDialogRef<RegisterSuccessDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
