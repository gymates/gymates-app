import { Injectable, signal } from '@angular/core';
import type { PopupType } from './popup.component';

export interface PopupEntry {
  id: number;
  message: string;
  type: PopupType;
}

@Injectable({ providedIn: 'root' })
export class PopupService {
  private counter = 0;

  readonly entries = signal<PopupEntry[]>([]);

  show(message: string, type: PopupType = 'info'): void {
    const id = ++this.counter;
    this.entries.update((list) => [...list, { id, message, type }]);
  }

  dismiss(id: number): void {
    this.entries.update((list) => list.filter((e) => e.id !== id));
  }
}
