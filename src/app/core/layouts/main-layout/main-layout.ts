import { Component, inject, afterNextRender, OnDestroy, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { NavigationItem } from '../../models/navigation.model';
import { SmartNavigationService } from '../../services/smart-navigation.service';
import { NavigationMenuComponent } from '../../components/navigation-menu/navigation-menu';
import { filter } from 'rxjs/operators';

/**
 * Main Layout Component
 * Simple navigation with conditional visibility based on visible sections
 * Shows only a "Back" button when not on home page
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
  private readonly location = inject(Location);
  private readonly navigationService = inject(SmartNavigationService);

  // Current route signal for better reactivity
  private readonly _currentRoute = signal<string>('/');

  // Expose navigation data to template (only for home page)
  readonly navigationItems = this.navigationService.navigationItems;
  readonly activeSection = this.navigationService.activeSection;
  
  // Navigation visibility from SmartNavigationService
  readonly shouldShowNavigation = this.navigationService.shouldShowNavigation;
  
  // Simple logic: show back button when NOT on home page
  readonly shouldShowBackButton = computed(() => {
    const currentUrl = this._currentRoute();
    return currentUrl !== '/' && currentUrl !== '';
  });
  
  // Mobile menu state (only used on home page)
  readonly isMobileMenuOpen = signal(false);

  constructor() {
    // Track route changes for better reactivity
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this._currentRoute.set(event.urlAfterRedirects);
    });

    // Initialize current route
    this._currentRoute.set(this.router.url);

    afterNextRender(() => {
      this.navigationService.initialize();
    });
  }

  /**
   * Toggle mobile menu (only for home page)
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
   * Handle navigation click (only for home page)
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

  /**
   * Go back to previous page using browser back (preserves scroll)
   */
  goBack(): void {
    // Use browser back for better scroll preservation
    this.location.back();
  }

  ngOnDestroy(): void {
    this.navigationService.destroy();
  }
}
