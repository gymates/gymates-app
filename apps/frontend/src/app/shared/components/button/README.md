# Custom Button Component

A reusable button component built with Angular signals and Angular Material, designed to work with Angular 19+ and prepared for future Signal Forms integration in Angular 21+.

## Features

- **Signal-based state management** using Angular's modern reactive primitives
- **Multiple variants** (primary, secondary, accent, warn, basic)
- **Size options** (small, medium, large)
- **Style modifiers** (outlined, raised, stroked, flat, rounded)
- **Icon support** with start/end positioning
- **Loading states** with spinner
- **Accessibility support** with proper ARIA attributes
- **TypeScript support** with full type safety
- **Responsive design** with mobile-friendly styles

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { ButtonComponent } from './shared/components/button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <app-button label="Click me" variant="primary" (clickEvent)="handleClick()" /> `,
})
export class ExampleComponent {
  handleClick(): void {
    console.log('Button clicked!');
  }
}
```

### With Icons

```typescript
@Component({
  template: `
    <app-button label="Save" icon="save" iconPosition="start" (clickEvent)="save()" />

    <app-button icon="delete" variant="warn" (clickEvent)="delete()" />
  `,
})
export class ExampleComponent {
  save(): void {
    // Save logic
  }

  delete(): void {
    // Delete logic
  }
}
```

### Loading States

```typescript
@Component({
  template: ` <app-button label="Submit" [loading]="isLoading()" (clickEvent)="submit()" /> `,
})
export class ExampleComponent {
  isLoading = signal(false);

  submit(): void {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
  }
}
```

## API Reference

### Input Properties

| Property       | Type                                                        | Default     | Description        |
| -------------- | ----------------------------------------------------------- | ----------- | ------------------ |
| `label`        | `string`                                                    | `''`        | Button text        |
| `type`         | `'button' \| 'submit' \| 'reset'`                           | `'button'`  | HTML button type   |
| `variant`      | `'primary' \| 'secondary' \| 'accent' \| 'warn' \| 'basic'` | `'primary'` | Color variant      |
| `size`         | `'small' \| 'medium' \| 'large'`                            | `'medium'`  | Button size        |
| `disabled`     | `boolean`                                                   | `false`     | Disable button     |
| `loading`      | `boolean`                                                   | `false`     | Show loading state |
| `icon`         | `string`                                                    | `''`        | Material icon name |
| `iconPosition` | `'start' \| 'end'`                                          | `'start'`   | Icon position      |
| `fullWidth`    | `boolean`                                                   | `false`     | Full width button  |
| `rounded`      | `boolean`                                                   | `false`     | Rounded corners    |
| `outlined`     | `boolean`                                                   | `false`     | Outlined style     |
| `raised`       | `boolean`                                                   | `false`     | Raised style       |
| `stroked`      | `boolean`                                                   | `false`     | Stroked style      |
| `flat`         | `boolean`                                                   | `false`     | Flat style         |
| `color`        | `string`                                                    | `''`        | Custom color       |
| `ariaLabel`    | `string`                                                    | `''`        | ARIA label         |
| `id`           | `string`                                                    | Random ID   | Custom button ID   |

### Output Events

| Event        | Type         | Description        |
| ------------ | ------------ | ------------------ |
| `clickEvent` | `MouseEvent` | Button click event |

### Type Definitions

```typescript
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'warn' | 'basic';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonState {
  disabled: boolean;
  loading: boolean;
  clicked: boolean;
  focused: boolean;
}
```

## Styling

The component includes comprehensive SCSS styles that:

### Color Variants

- **Primary**: Blue (#1976d2) - Main actions
- **Secondary**: Gray (#9e9e9e) - Secondary actions
- **Accent**: Pink (#ff4081) - Accent actions
- **Warn**: Red (#f44336) - Destructive actions
- **Basic**: Transparent with border - Minimal style

### Size Variants

- **Small**: 32px height, 0.875rem font
- **Medium**: 40px height, 1rem font
- **Large**: 48px height, 1.125rem font

### Style Modifiers

- **Outlined**: Transparent background with colored border
- **Raised**: Box shadow for depth
- **Stroked**: 2px border
- **Flat**: No background, minimal styling
- **Rounded**: 50px border radius

### State Styles

- **Hover**: Lift effect with shadow
- **Clicked**: Scale animation
- **Loading**: Spinner with overlay
- **Disabled**: Reduced opacity, no interactions
- **Focused**: Blue outline for accessibility

## Accessibility

- Semantic HTML5 button element
- Proper ARIA attributes (`aria-label`, `aria-disabled`)
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion support

## Responsive Design

- Mobile-friendly touch targets (min 44px)
- Flexible layouts for small screens
- Adaptive sizing for mobile devices

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Integration with Angular Material

The component extends Angular Material's `mat-button` directive, providing:

- Consistent theming with Material Design
- Built-in ripple effects
- Material Design typography
- Theme-aware colors
- Accessibility features

## Performance

- **OnPush change detection** for optimal performance
- **Signal-based state management** for efficient updates
- **Minimal re-renders** with computed signals
- **Lazy loading** of icons and spinners
- **Optimized animations** with CSS transforms

## Migration to Signal Forms (Angular 21+)

This component is designed to be compatible with future Signal Forms:

1. **Signal-based state** already implemented
2. **Reactive patterns** compatible with Signal Forms
3. **Type safety** maintained across versions
4. **Performance optimizations** ready for Signal Forms

### Future Integration

```typescript
// Future Angular 21+ integration possibilities
import { form, signal } from '@angular/core';
import { formSignal } from '@angular/forms/signals';

@Component({
  template: ` <app-button [state]="buttonForm.state()" /> `,
})
export class FutureExampleComponent {
  buttonForm = form({
    clicked: signal(false),
    loading: signal(false),
    disabled: signal(false),
  });
}
```
