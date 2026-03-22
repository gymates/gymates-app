import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import type { components } from '../../../shared/api-types';
import { ButtonComponent } from '../../../shared/components/button';
import { InputComponent } from '../../../shared/components/input/input.component';
import { PopupService } from '../../../shared/components/popup';
import { RegisterSuccessDialogComponent } from './register-success-dialog.component';

type RegisterRequest = components['schemas']['RegisterRequest'];

@Component({
  selector: 'app-page-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, InputComponent, ButtonComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private popup = inject(PopupService);

  isLoading = signal<boolean>(false);

  form = this.fb.group(
    {
      firstName: this.fb.control('', {
        validators: [Validators.required],
      }),
      lastName: this.fb.control('', {
        validators: [Validators.required],
      }),
      username: this.fb.control('', {
        validators: [Validators.required],
      }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required],
      }),
    },
    { validators: [this.passwordsMatchValidator()] },
  );

  private formStatus = toSignal(this.form.statusChanges.pipe(startWith(this.form.status)));

  readonly canSubmit = computed(() => this.formStatus() === 'VALID' && !this.isLoading());

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    this.auth.register(this.prepareRequestData()).subscribe({
      next: () => {
        this.form.reset();
        this.isLoading.set(false);
        const ref = this.dialog.open(RegisterSuccessDialogComponent, {
          width: '360px',
          disableClose: true,
        });
        ref.afterClosed().subscribe(() => this.router.navigate(['/login']));
      },
      error: () => {
        this.popup.show('Registration failed. Please try again.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  private prepareRequestData(): RegisterRequest {
    const value = this.form.getRawValue();
    return {
      firstName: value.firstName,
      lastName: value.lastName,
      username: value.username,
      email: value.email,
      password: value.password,
    };
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('password');
      const confirmControl = control.get('confirmPassword');

      if (!confirmControl || !passwordControl) return null;

      if (passwordControl.value && confirmControl.value && passwordControl.value !== confirmControl.value) {
        confirmControl.setErrors({
          ...(confirmControl.errors || {}),
          mismatch: true,
        });
        return { mismatch: true };
      }

      // If previously set, remove mismatch while preserving other errors
      const currentErrors = { ...confirmControl.errors };
      if (currentErrors && 'mismatch' in currentErrors) {
        delete currentErrors['mismatch'];
        confirmControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
      }
      return null;
    };
  }
}
