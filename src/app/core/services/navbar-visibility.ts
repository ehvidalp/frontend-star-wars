import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NavbarVisibilityService {
  private readonly router = inject(Router);
  private readonly _isWelcomeVisible = signal<boolean>(true);
  readonly shouldShowNavbar = computed(() => {
    const currentUrl = this.router.url;
    const isWelcomeVisible = this._isWelcomeVisible();
    if (currentUrl === '/') {
      return !isWelcomeVisible;
    }
    return true;
  });
  readonly shouldShowBackButton = computed(() => {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/planets/') && currentUrl.split('/').length === 3;
  });
  setWelcomeVisibility(isVisible: boolean): void {
    this._isWelcomeVisible.set(isVisible);
  }
  isWelcomeVisible(): boolean {
    return this._isWelcomeVisible();
  }
}
