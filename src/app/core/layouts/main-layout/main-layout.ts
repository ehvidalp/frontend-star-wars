import { Component, inject, afterNextRender, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavigationItem } from '../../models/navigation.model';
import { SmartNavigationService } from '../../services/smart-navigation.service';

/**
 * Main Layout Component
 * Simple, focused, and pragmatic
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnDestroy {
  private readonly router = inject(Router);
  private readonly navigationService = inject(SmartNavigationService);

  // Expose navigation data to template
  readonly navigationItems = this.navigationService.navigationItems;
  readonly activeSection = this.navigationService.activeSection;

  constructor() {
    afterNextRender(() => {
      this.navigationService.initialize();
    });
  }

  /**
   * Handle navigation click
   */
  async onNavigate(item: NavigationItem): Promise<void> {
    try {
      // Update active state immediately for UI responsiveness
      this.navigationService.setActiveSection(item.id);
      
      // Add click animation
      this.navigationService.addClickAnimation(item.id);
      
      // Navigate and scroll
      await this.router.navigate(['/']);
      
      setTimeout(() => {
        this.navigationService.scrollToSection(item.targetId);
      }, 100);
      
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }

  ngOnDestroy(): void {
    this.navigationService.destroy();
  }
}
