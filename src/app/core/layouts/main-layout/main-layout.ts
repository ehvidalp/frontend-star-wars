import { Component, inject, afterNextRender, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { NavigationItem } from '@core/models/navigation.model';
import { SmartNavigationService } from '@core/services/smart-navigation';
import { NavigationMenuComponent } from '@core/components/navigation-menu/navigation-menu';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationMenuComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout implements OnDestroy {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly navigationService = inject(SmartNavigationService);
  private readonly _currentRoute = signal<string>('/');
  readonly navigationItems = this.navigationService.navigationItems;
  readonly activeSection = this.navigationService.activeSection;
  readonly shouldShowNavigation = this.navigationService.shouldShowNavigation;
  readonly shouldShowBackButton = computed(() => {
    const currentUrl = this._currentRoute();
    return currentUrl !== '/' && currentUrl !== '';
  });
  
  readonly navbarBackgroundClasses = computed(() => {
    const currentUrl = this._currentRoute();
    const isHomePage = currentUrl === '/' || currentUrl === '';
    
    if (isHomePage) {
      return 'bg-black/90 backdrop-blur-md border-b border-cyan-400/20';
    }
    
    // Clean transparent background for other routes
    return 'bg-transparent';
  });

  readonly navbarShadowClasses = computed(() => {
    const currentUrl = this._currentRoute();
    const isHomePage = currentUrl === '/' || currentUrl === '';
    
    if (isHomePage) {
      return 'shadow-lg shadow-cyan-400/10';
    }
    
    // No shadow for other routes
    return 'shadow-none';
  });

  readonly mobileNavClasses = computed(() => {
    const currentUrl = this._currentRoute();
    const isHomePage = currentUrl === '/' || currentUrl === '';
    
    return isHomePage ? 'home-page' : 'other-page';
  });
  readonly isMobileMenuOpen = signal(false);
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this._currentRoute.set(event.urlAfterRedirects);
    });
    this._currentRoute.set(this.router.url);
    afterNextRender(() => {
      this.navigationService.initialize();
    });
  }
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
  async onNavigate(item: NavigationItem): Promise<void> {
    try {
      this.closeMobileMenu();
      this.navigationService.setActiveSection(item.id);
      this.navigationService.addClickAnimation(item.id);
      await this.router.navigate(['/']);
      this.navigationService.scrollToSection(item.targetId);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }
  goBack(): void {
    this.location.back();
  }
  ngOnDestroy(): void {
    // No need to call destroy on service anymore - using takeUntilDestroyed
  }
}
