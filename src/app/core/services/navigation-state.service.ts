import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly _currentRoute = signal<string>('');
  private readonly _previousRoute = signal<string>('');
  private readonly _navigationHistory = signal<string[]>([]);
  private readonly routeEvents$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => (event as NavigationEnd).urlAfterRedirects),
    startWith(this.router.url)
  );
  private readonly currentRoute = toSignal(this.routeEvents$, { initialValue: '' });
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
    return route === '/planets' || route.startsWith('/planets/');
  });
  readonly shouldShowBackButton = computed(() => {
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
    this.routeEvents$.subscribe(url => {
      this.updateNavigationState(url);
    });
    this.updateNavigationState(this.router.url);
  }
  private updateNavigationState(url: string): void {
    const currentRoute = this._currentRoute();
    if (currentRoute !== url) {
      if (currentRoute) {
        this._previousRoute.set(currentRoute);
      }
      this._currentRoute.set(url);
      this._navigationHistory.update(history => {
        const newHistory = [...history, url];
        return newHistory.slice(-10);
      });
    }
  }
  goBack(): void {
    const history = this._navigationHistory();
    if (history.length > 1) {
      this._navigationHistory.update(h => h.slice(0, -1));
      const previousRoute = history[history.length - 2];
      this.router.navigate([previousRoute]);
    } else {
      if (this.canUseBrowserBack()) {
        this.location.back();
      } else {
        this.router.navigate(['/']);
      }
    }
  }
  goToPlanets(): void {
    this.router.navigate(['/planets']);
  }
  goToHome(): void {
    this.router.navigate(['/']);
  }
  goToPlanetDetail(planetId: string): void {
    this.router.navigate(['/planets', planetId]);
  }
  reset(): void {
    this._currentRoute.set('');
    this._previousRoute.set('');
    this._navigationHistory.set([]);
  }
  private canUseBrowserBack(): boolean {
    return typeof window !== 'undefined' && window.history.length > 1;
  }
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
