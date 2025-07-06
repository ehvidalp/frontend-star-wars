import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

/**
 * Navigation State Service
 * Manages intelligent navigation state and visibility logic
 * Following Angular 20 best practices with signals
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  // Core navigation state
  private readonly _currentRoute = signal<string>('');
  private readonly _previousRoute = signal<string>('');
  private readonly _navigationHistory = signal<string[]>([]);

  // Route observables converted to signals
  private readonly routeEvents$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => (event as NavigationEnd).urlAfterRedirects),
    startWith(this.router.url)
  );

  private readonly currentRoute = toSignal(this.routeEvents$, { initialValue: '' });

  // Computed navigation state
  readonly isHomePage = computed(() => {
    const route = this.currentRoute();
    return route === '/' || route === '';
  });

  readonly isPlanetsListPage = computed(() => {
    const route = this.currentRoute();
    return route === '/planets';
  });

  readonly isPlanetDetailPage = computed(() => {
    const route = this.currentRoute();
    return route.startsWith('/planets/') && route.split('/').length === 3;
  });

  readonly shouldShowNavigation = computed(() => {
    const route = this.currentRoute();
    
    // Show navigation when:
    // 1. On dedicated planets list page (/planets)
    // 2. On planet detail page (/planets/:id)
    // Hide navigation when:
    // 1. On home page (landing page) - the welcome section needs full screen
    return route === '/planets' || route.startsWith('/planets/');
  });

  readonly shouldShowBackButton = computed(() => {
    // Show back button only when:
    // 1. On planet detail page (not on planets list)
    return this.isPlanetDetailPage();
  });

  readonly canGoBack = computed(() => {
    return this._navigationHistory().length > 1;
  });

  readonly backButtonText = computed(() => {
    const history = this._navigationHistory();
    if (history.length < 2) return 'Back';
    
    const previousRoute = history[history.length - 2];
    if (previousRoute === '/' || previousRoute === '') return 'Home';
    if (previousRoute === '/planets') return 'Planets';
    return 'Back';
  });

  constructor() {
    // Initialize route tracking
    this.routeEvents$.subscribe(url => {
      this.updateNavigationState(url);
    });

    // Set initial route
    this.updateNavigationState(this.router.url);
  }

  private updateNavigationState(url: string): void {
    const currentRoute = this._currentRoute();
    
    if (currentRoute !== url) {
      // Update previous route
      if (currentRoute) {
        this._previousRoute.set(currentRoute);
      }
      
      // Update current route
      this._currentRoute.set(url);
      
      // Update history
      this._navigationHistory.update(history => {
        const newHistory = [...history, url];
        // Keep only last 10 entries for performance
        return newHistory.slice(-10);
      });
    }
  }

  /**
   * Navigate back to previous page
   */
  goBack(): void {
    const history = this._navigationHistory();
    
    if (history.length > 1) {
      // Remove current route from history
      this._navigationHistory.update(h => h.slice(0, -1));
      
      // Navigate to previous route
      const previousRoute = history[history.length - 2];
      this.router.navigate([previousRoute]);
    } else {
      // Fallback to browser back or home
      if (this.canUseBrowserBack()) {
        this.location.back();
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  /**
   * Navigate to planets list
   */
  goToPlanets(): void {
    this.router.navigate(['/planets']);
  }

  /**
   * Navigate to home
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to planet detail
   */
  goToPlanetDetail(planetId: string): void {
    this.router.navigate(['/planets', planetId]);
  }

  /**
   * Reset navigation state
   */
  reset(): void {
    this._currentRoute.set('');
    this._previousRoute.set('');
    this._navigationHistory.set([]);
  }

  /**
   * Check if browser back is available
   */
  private canUseBrowserBack(): boolean {
    return typeof window !== 'undefined' && window.history.length > 1;
  }

  /**
   * Get current route info
   */
  getCurrentRouteInfo() {
    return {
      current: this._currentRoute(),
      previous: this._previousRoute(),
      history: this._navigationHistory(),
      isHome: this.isHomePage(),
      isPlanetsList: this.isPlanetsListPage(),
      isPlanetDetail: this.isPlanetDetailPage(),
      shouldShowNavigation: this.shouldShowNavigation(),
      shouldShowBackButton: this.shouldShowBackButton(),
      canGoBack: this.canGoBack(),
      backButtonText: this.backButtonText()
    };
  }
}
