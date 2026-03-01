import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  Injector,
  input,
  model,
  Provider,
  signal,
} from '@angular/core';
import { AbstractControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface InputFieldState {
  value: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  errors: string[];
}

export interface InputValidators {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | null;
}

// Provider for ControlValueAccessor
export const INPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [INPUT_VALUE_ACCESSOR],
})
export class InputComponent {
  // Input properties
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly disabled = model<boolean>(false);
  readonly readonly = model<boolean>(false);
  readonly required = model<boolean>(false);
  readonly autocomplete = input<string>('off');
  readonly id = input<string>(`input-${Math.random().toString(36).substr(2, 9)}`);

  // Validators
  readonly validators = input<InputValidators>({});

  // Reactive Forms support
  readonly formControl = input<AbstractControl | null>(null);
  private ngControl: NgControl | null = null;

  // Model for two-way binding
  readonly value = model<string>('');

  // Internal signals for state management
  private touchedSignal = signal<boolean>(false);
  private dirtySignal = signal<boolean>(false);
  private errorsSignal = signal<string[]>([]);

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {
    // Default implementation - will be overridden by registerOnChange
  };
  private onTouched: () => void = () => {
    // Default implementation - will be overridden by registerOnTouched
  };

  // Public getters for template access
  readonly touched = this.touchedSignal.asReadonly();
  readonly dirty = this.dirtySignal.asReadonly();
  readonly isValid = computed(() => {
    const fc = this.formControl();
    if (fc) {
      return fc.valid && !fc.pending;
    }
    return this.errorsSignal().length === 0;
  });
  readonly state = computed<InputFieldState>(() => {
    const fc = this.formControl();
    if (fc) {
      return {
        value: fc.value || '',
        touched: fc.touched,
        dirty: fc.dirty,
        valid: fc.valid && !fc.pending,
        errors: this.getFormControlErrors(fc),
      };
    }
    return {
      value: this.value(),
      touched: this.touchedSignal(),
      dirty: this.dirtySignal(),
      valid: this.isValid(),
      errors: this.errorsSignal(),
    };
  });

  constructor(private injector: Injector) {
    // Validate on value change for template-driven mode
    effect(() => {
      const fc = this.formControl();
      if (!fc) {
        this.validate(this.value());
      }
    });
  }

  private validate(value: string): void {
    const errors: string[] = [];
    const validators = this.validators();

    // Required validation
    if (validators.required && !value.trim()) {
      errors.push('This field is required');
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !validators.required) {
      this.errorsSignal.set(errors);
      return;
    }

    // Min length validation
    if (validators.minLength && value.length < validators.minLength) {
      errors.push(`Minimum length is ${validators.minLength} characters`);
    }

    // Max length validation
    if (validators.maxLength && value.length > validators.maxLength) {
      errors.push(`Maximum length is ${validators.maxLength} characters`);
    }

    // Pattern validation
    if (validators.pattern && !validators.pattern.test(value)) {
      errors.push('Invalid format');
    }

    // Email validation
    if (validators.email) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(value)) {
        errors.push('Invalid email address');
      }
    }

    // Custom validation
    if (validators.custom) {
      const customError = validators.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    this.errorsSignal.set(errors);
  }

  // Event handlers
  onFocus(): void {
    const fc = this.formControl();
    if (fc) {
      fc.markAsTouched();
      this.onTouched();
    } else {
      this.touchedSignal.set(true);
    }
  }

  onBlur(): void {
    const fc = this.formControl();
    if (fc) {
      fc.markAsTouched();
      this.onTouched();
    } else {
      this.touchedSignal.set(true);
    }
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;

    const fc = this.formControl();
    if (fc) {
      fc.setValue(newValue);
      fc.markAsDirty();
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
      this.dirtySignal.set(true);
      this.onChange(newValue);
    }
  }

  // Public API for programmatic access
  focus(): void {
    const inputElement = document.getElementById(this.id());
    inputElement?.focus();
  }

  reset(): void {
    this.value.set('');
    this.touchedSignal.set(false);
    this.dirtySignal.set(false);
    this.errorsSignal.set([]);
  }

  getErrorMessages(): string[] {
    const fc = this.formControl();
    if (fc) {
      // Only return errors if field is touched
      if (!fc.touched || fc.pending) return [];
      return this.getFormControlErrors(fc);
    }
    // For template-driven forms
    if (!this.touchedSignal()) return [];
    return this.errorsSignal();
  }

  getFirstError(): string {
    const errors = this.getErrorMessages();
    return errors.length > 0 ? errors[0] : '';
  }

  hasErrors(): boolean {
    const fc = this.formControl();
    if (fc) {
      return fc.invalid && fc.touched && !fc.pending;
    }
    return this.errorsSignal().length > 0 && this.touchedSignal();
  }

  private getFormControlErrors(control: AbstractControl): string[] {
    const errors: string[] = [];
    if (!control.errors) return errors;

    const errorKeys = Object.keys(control.errors);
    for (const key of errorKeys) {
      switch (key) {
        case 'required':
          errors.push('This field is required');
          break;
        case 'email':
          errors.push('Invalid email address');
          break;
        case 'mismatch':
          errors.push('Passwords do not match');
          break;
        case 'minlength':
          errors.push(`Minimum length is ${control.errors[key].requiredLength} characters`);
          break;
        case 'maxlength':
          errors.push(`Maximum length is ${control.errors[key].requiredLength} characters`);
          break;
        case 'pattern':
          errors.push('Invalid format');
          break;
        default:
          errors.push('Invalid input');
      }
    }
    return errors;
  }

  // ControlValueAccessor implementation
  writeValue(value: unknown): void {
    if (value !== undefined && value !== null) {
      this.value.set(String(value));
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
