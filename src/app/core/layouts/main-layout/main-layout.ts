import { Component, inject, afterNextRender, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavigationItem } from '../../models/navigation.model';
import { SmartNavigationService } from '../../services/smart-navigation.service';
import { NavigationMenuComponent } from '../../components/navigation-menu/navigation-menu';

/**
 * Main Layout Component
 * Clean, responsive navigation following project architecture
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationMenuComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnDestroy {
  private readonly router = inject(Router);
  private readonly navigationService = inject(SmartNavigationService);

  // Expose navigation data to template
  readonly navigationItems = this.navigationService.navigationItems;
  readonly activeSection = this.navigationService.activeSection;
  
  // Mobile menu state
  readonly isMobileMenuOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      this.navigationService.initialize();
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Handle navigation click
   */
  async onNavigate(item: NavigationItem): Promise<void> {
    try {
      // Close mobile menu if open
      this.closeMobileMenu();
      
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
