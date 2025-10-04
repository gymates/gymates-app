import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import type { components } from '../../../shared/api-types';

type RegisterRequest = components['schemas']['RegisterRequest'];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);

  // UI state signals
  isLoading = signal<boolean>(false);
  isSuccess = signal<boolean>(false);
  isError = signal<boolean>(false);

  form = this.fb.group(
    {
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

  readonly canSubmit = computed(() => this.form.valid && !this.isLoading());

  submit(): void {
    this.isSuccess.set(false);
    this.isError.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);

    this.auth.register(this.prepareRequestData()).subscribe({
      next: () => {
        this.isSuccess.set(true);
        this.form.reset();
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private prepareRequestData(): RegisterRequest {
    const value = this.form.getRawValue();
    return {
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
