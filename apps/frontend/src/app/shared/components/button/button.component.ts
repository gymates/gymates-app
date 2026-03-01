import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'primary' | 'accent' | 'warn';
export type ButtonSize = 'small' | 'medium' | 'large';
export type MaterialStyle = 'flat' | 'raised' | 'stroked' | 'outlined' | 'basic';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // ViewChild for programmatic access
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonElement');

  // Input properties
  readonly label = input<string>('');
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly materialStyle = input<MaterialStyle>('flat');
  readonly size = input<ButtonSize>('medium');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly icon = input<string>('');
  readonly iconPosition = input<'start' | 'end'>('start');
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string>('');

  // Computed signals
  readonly buttonClasses = computed(() => {
    const classes: string[] = [];

    // Size classes
    classes.push(`btn-${this.size()}`);

    // State classes
    if (this.loading()) classes.push('btn-loading');

    // Layout classes
    if (this.fullWidth()) classes.push('btn-full-width');

    return classes;
  });

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly showIcon = computed(() => !!this.icon() && !this.loading());

  // Event handlers
  onClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Emit click event for parent components (secure - MouseEvent is browser-provided)
    this.clickEvent.emit(event);
  }

  // Public API for programmatic access
  focus(): void {
    this.buttonRef()?.nativeElement.focus();
  }

  click(): void {
    this.buttonRef()?.nativeElement.click();
  }

  // Output events
  readonly clickEvent = output<MouseEvent>();
}
