import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { POPUP_DURATION } from '../../tokens';

export type PopupType = 'success' | 'error' | 'info' | 'warning';

const TICK_MS = 50;

const ICON_MAP: Record<PopupType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit {
  private readonly duration = inject(POPUP_DURATION);
  private readonly destroyRef = inject(DestroyRef);

  readonly message = input.required<string>();
  readonly type = input<PopupType>('info');
  readonly closable = input<boolean>(true);

  readonly closed = output<void>();

  readonly iconMap = ICON_MAP;

  /** Progress: 100 → 0, drives the visual progress bar */
  readonly progress = signal<number>(100);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startTimer();
    this.destroyRef.onDestroy(() => this.clearTimer());
  }

  onMouseEnter(): void {
    this.clearTimer();
  }

  onMouseLeave(): void {
    this.progress.set(100);
    this.startTimer();
  }

  close(): void {
    this.clearTimer();
    this.closed.emit();
  }

  private startTimer(): void {
    const decrement = 100 / (this.duration / TICK_MS);

    this.intervalId = setInterval(() => {
      const next = this.progress() - decrement;
      if (next <= 0) {
        this.progress.set(0);
        this.clearTimer();
        this.closed.emit();
      } else {
        this.progress.set(next);
      }
    }, TICK_MS);
  }

  private clearTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
