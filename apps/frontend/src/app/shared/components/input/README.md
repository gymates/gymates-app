# Custom Input Component

A reusable input component built with Angular signals and Angular Material, designed to work with Angular 19+ and prepared for future Signal Forms integration in Angular 21+.

## Features

- **Signal-based state management** using Angular's modern reactive primitives
- **Built-in validation** with common validators (required, email, minLength, maxLength, pattern, custom)
- **Two-way data binding** with `[(value)]` syntax
- **Angular Material integration** with consistent styling
- **Accessibility support** with proper ARIA attributes
- **TypeScript support** with full type safety
- **Responsive design** with mobile-friendly styles

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { InputComponent } from './shared/components/input';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [InputComponent],
  template: ` <app-input label="Email" type="email" placeholder="Enter your email" [(value)]="email" /> `,
})
export class ExampleComponent {
  email = '';
}
```

### With Validation

```typescript
@Component({
  template: `
    <app-input
      label="Password"
      type="password"
      placeholder="Enter your password"
      [validators]="{
        required: true,
        minLength: 8,
        custom: passwordValidator,
      }"
      [(value)]="password"
    />
  `,
})
export class ExampleComponent {
  password = '';

  passwordValidator = (value: string): string | null => {
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }
    return null;
  };
}
```

## API Reference

### Input Properties

| Property       | Type                                                            | Default     | Description                    |
| -------------- | --------------------------------------------------------------- | ----------- | ------------------------------ |
| `label`        | `string`                                                        | `''`        | Input label text               |
| `placeholder`  | `string`                                                        | `''`        | Placeholder text               |
| `type`         | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'`    | Input type                     |
| `appearance`   | `'fill' \| 'outline'`                                           | `'outline'` | Material form field appearance |
| `disabled`     | `boolean`                                                       | `false`     | Disable the input              |
| `readonly`     | `boolean`                                                       | `false`     | Make input read-only           |
| `required`     | `boolean`                                                       | `false`     | Mark input as required         |
| `autocomplete` | `string`                                                        | `'off'`     | Autocomplete attribute         |
| `id`           | `string`                                                        | Random ID   | Custom input ID                |
| `validators`   | `InputValidators`                                               | `{}`        | Validation rules               |

### Two-way Binding

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| `value`  | `string` | Two-way bound input value |

### Validation Interface

```typescript
interface InputValidators {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | null;
}
```

### State Interface

```typescript
interface InputFieldState {
  value: string;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  errors: string[];
}
```

## Migration to Signal Forms (Angular 21+)

This component is designed to be easily migrated to Signal Forms when upgrading to Angular 21+. The migration path includes:

1. Replace custom signal-based validation with native Signal Forms validators
2. Use `form()` function instead of custom state management
3. Replace `[formField]` directive integration
4. Update validation schema to use Signal Forms syntax

### Future Signal Forms Usage

```typescript
// Future Angular 21+ implementation
import { form, required, email, minLength } from '@angular/forms/signals';

@Component({
  template: ` <input [formField]="loginForm.email" /> `,
})
export class FutureExampleComponent {
  loginModel = signal({ email: '' });
  loginForm = form(this.loginModel, (schema) => {
    required(schema.email);
    email(schema.email);
  });
}
```

## Styling

The component includes custom SCSS styles that:

- Provide visual feedback for validation states
- Include smooth animations for error messages
- Support responsive design for mobile devices
- Maintain consistency with Angular Material theme

## Accessibility

- Proper label association with `mat-label`
- Semantic HTML5 input types
- ARIA attributes for validation states
- Keyboard navigation support
- Screen reader friendly error messages

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers
