import { Component } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [MatSidenavContainer],
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {}
