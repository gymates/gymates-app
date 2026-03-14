import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { startWith } from 'rxjs';

/** Default human-readable messages for built-in Angular validators. */
const DEFAULT_ERROR_MESSAGES: Record<string, (err: unknown) => string> = {
  required: () => 'This field is required.',
  email: () => 'Enter a valid email address.',
  minlength: (err: unknown) => {
    const e = err as { requiredLength: number };
    return `Minimum length is ${e.requiredLength} characters.`;
  },
  maxlength: (err: unknown) => {
    const e = err as { requiredLength: number };
    return `Maximum length is ${e.requiredLength} characters.`;
  },
  min: (err: unknown) => {
    const e = err as { min: number };
    return `Minimum value is ${e.min}.`;
  },
  max: (err: unknown) => {
    const e = err as { max: number };
    return `Maximum value is ${e.max}.`;
  },
  pattern: () => 'Invalid format.',
};

/**
 * Reusable input wrapper that integrates with Angular Reactive Forms.
 *
 * All validators are defined at the **parent** component level — this
 * component only reacts to the resulting state and renders error messages.
 * Supply custom messages via the `errorMessages` input, keyed by validator name.
 *
 * @example
 * <app-input
 *   label="Email"
 *   type="email"
 *   [formControl]="form.controls.email"
 *   [errorMessages]="{ required: 'Email is required.', email: 'Invalid email.' }"
 * />
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // ── Inputs ─────────────────────────────────────────────────────────
  readonly label = input<string>('');
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('off');
  /** Kept for API compatibility; currently drives no visual variant. */
  readonly appearance = input<MatFormFieldAppearance>('outline');

  /**
   * Override or extend default error messages.
   * Keys are validator names (e.g. `'required'`, `'minlength'`, `'email'`).
   */
  readonly errorMessages = input<Record<string, string>>({});

  // ── Unique element ID (for label ↔ input association) ──────────────
  private static _idCounter = 0;
  readonly inputId = `app-input-${++InputComponent._idCounter}`;

  // ── Internal signals ────────────────────────────────────────────────
  readonly _value = signal<string>('');
  readonly _disabled = signal<boolean>(false);
  readonly _showPassword = signal<boolean>(false);

  /**
   * Writable signal kept in sync with the parent FormControl's validity status.
   * Updated both via subscription (statusChanges) and imperatively on blur.
   */
  private readonly _controlStatus = signal<string>('VALID');

  /**
   * Monotonically-increasing tick incremented on every blur.
   * Forces `hasError` computed to re-run even when status hasn't changed,
   * so the `touched` flag (set by `_onTouched`) is picked up immediately.
   */
  private readonly _touchedTick = signal<number>(0);

  // ── Computed ────────────────────────────────────────────────────────

  /** Flips between 'password' ↔ 'text' when the visibility toggle is active. */
  readonly resolvedType = computed(() => (this.type() === 'password' && this._showPassword() ? 'text' : this.type()));

  readonly isPasswordField = computed(() => this.type() === 'password');

  readonly hasError = computed(() => {
    // Subscribe to both status and touched tick so this recomputes on either change.
    const status = this._controlStatus();
    this._touchedTick();
    return status === 'INVALID' && (this._ngControl?.control?.touched ?? false);
  });

  readonly errorMessage = computed((): string | null => {
    if (!this.hasError()) return null;
    const errors: ValidationErrors | null = this._ngControl?.control?.errors ?? null;
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    const custom = this.errorMessages();
    if (custom[firstKey]) return custom[firstKey];

    const defaultFn = DEFAULT_ERROR_MESSAGES[firstKey];
    return defaultFn ? defaultFn(errors[firstKey]) : `Invalid: ${firstKey}`;
  });

  // ── ControlValueAccessor ─────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _onTouched: () => void = () => {};

  /**
   * Reference to the parent NgControl (FormControlDirective / FormControlName).
   * We inject Injector here to fetch NgControl dynamically in ngOnInit,
   * avoiding the NG0200 circular dependency cycle.
   */
  private readonly injector = inject(Injector);
  private _ngControl: NgControl | null = null;

  ngOnInit(): void {
    // Dynamically inject NgControl to break the circular dependency between
    // NG_VALUE_ACCESSOR and NgControl.
    // We use the signature that accepts InjectOptions (cast to unknown to bypass strict rules).
    this._ngControl = this.injector.get(NgControl, null, { optional: true, self: true } as unknown as {
      optional: true;
    });

    const control = this._ngControl?.control;
    if (!control) return;

    // Mirror the FormControl's status observable into our writable signal so
    // computed() signals stay reactive without needing the toSignal() cast.
    control.statusChanges
      .pipe(startWith(control.status), takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => this._controlStatus.set(status as string));
  }

  // ── ControlValueAccessor interface ──────────────────────────────────
  writeValue(value: string): void {
    this._value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  // ── DOM event handlers ───────────────────────────────────────────────
  handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this._onChange(value);
  }

  handleBlur(): void {
    this._onTouched();
    // Increment the tick to force hasError recomputation now that touched = true.
    this._touchedTick.update((n) => n + 1);
  }

  togglePasswordVisibility(inputEl: HTMLInputElement): void {
    // Save the current DOM value BEFORE Angular changes [type], because some
    // browsers (Safari, Firefox) clear the input value when type is swapped.
    const currentValue = inputEl.value;
    this._showPassword.update((v) => !v);
    // Restore value + focus after the next microtask (after Angular has
    // updated [type] in the DOM via change detection).
    Promise.resolve().then(() => {
      inputEl.value = currentValue;
      inputEl.focus();
    });
  }
}
