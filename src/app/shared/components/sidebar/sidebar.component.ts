import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isSidebarOpen = false; // Sidebar state
  currentSidebarTab: string | null = null; // Current tab
  private closeTimeout: any = null; // Timeout for auto-closing sidebar

  // Open sidebar on hover
  openSidebar(tab: string) {
    this.isSidebarOpen = true;
    this.currentSidebarTab = tab;
    this.clearCloseTimeout(); // Clear any existing timeout
  }

  // Start timeout to close sidebar after 1 second
  startCloseTimeout() {
    this.clearCloseTimeout(); // Clear any existing timeout
    this.closeTimeout = setTimeout(() => {
      this.isSidebarOpen = false;
      this.currentSidebarTab = null;
    }, 1000);
  }

  // Clear the close timeout
  clearCloseTimeout() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }
}