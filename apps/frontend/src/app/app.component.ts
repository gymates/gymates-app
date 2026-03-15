import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopupContainerComponent } from './shared/components/popup';

@Component({
  imports: [RouterModule, PopupContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
