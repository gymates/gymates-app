import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthStore } from './auth.store';

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective {
  private authStore = inject(AuthStore);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);

  @Input() set appHasRole(role: string | string[]) {
    const roles = Array.isArray(role) ? role : [role];
    const userRole = this.authStore.userRole();

    if (userRole && roles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
