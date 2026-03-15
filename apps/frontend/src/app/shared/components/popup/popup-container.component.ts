import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PopupComponent } from './popup.component';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-popup-container',
  standalone: true,
  imports: [PopupComponent],
  template: `
    <div class="popup-container">
      @for (entry of popupService.entries(); track entry.id) {
        <app-popup [message]="entry.message" [type]="entry.type" (closed)="popupService.dismiss(entry.id)" />
      }
    </div>
  `,
  styles: `
    .popup-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      pointer-events: none;

      app-popup {
        pointer-events: all;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupContainerComponent {
  readonly popupService = inject(PopupService);
}
