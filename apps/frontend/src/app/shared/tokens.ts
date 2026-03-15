import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');

/** Duration (ms) after which a popup auto-dismisses. Default: 5000 ms. */
export const POPUP_DURATION = new InjectionToken<number>('POPUP_DURATION', {
  providedIn: 'root',
  factory: () => 5000,
});
