import { Injectable, signal, computed, inject, DestroyRef, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { NavigationSection, NavigationTarget, NavigationItem } from '@core/models/navigation.model';
@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly _activeSection = signal<NavigationSection>(NavigationSection.START);
  private readonly _isWelcomeVisible = signal<boolean>(true);
  private readonly _navigationVisible = signal<boolean>(false);
  private readonly _pendingNavUpdate = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.addNavigationAnimations();
    });
  }
  private readonly _navigationItems = signal<NavigationItem[]>([
    {
      id: NavigationSection.START,
      label: 'Start',
      ariaLabel: 'Navigate to welcome section',
      targetId: NavigationTarget.WELCOME
    },
    {
      id: NavigationSection.PLANETS,
      label: 'Planets',
      ariaLabel: 'Navigate to planets list section',
      targetId: NavigationTarget.PLANETS_LIST
    }
  ]);
  readonly navigationItems = computed(() => this._navigationItems());
  readonly activeSection = computed(() => this._activeSection());
  readonly shouldShowNavigation = computed(() => {
    const currentUrl = this.router.url;
    const isWelcomeVisible = this._isWelcomeVisible();
    const navigationVisible = this._navigationVisible();
    
    // On home page, show navigation only when welcome is NOT visible AND navbar is set to visible
    if (currentUrl === '/' || currentUrl === '') {
      return !isWelcomeVisible && navigationVisible;
    }
    
    // On other pages, always show navigation
    return true;
  });
  
  setWelcomeVisibility(isVisible: boolean): void {
    // Always update the welcome visibility state
    this._isWelcomeVisible.set(isVisible);
    
    // Cancel any pending navigation update
    this._pendingNavUpdate.set(false);
    
    // Immediately hide navigation when welcome is visible
    if (isVisible) {
      this._navigationVisible.set(false);
    } else {
      // Set pending update and use timer for delay
      this._pendingNavUpdate.set(true);
      
      timer(150)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          // Only update if still pending (not cancelled)
          if (this._pendingNavUpdate()) {
            this._navigationVisible.set(true);
            this._pendingNavUpdate.set(false);
          }
        });
    }
    
    this.scheduleNavigationUpdate();
  }
  
  private scheduleNavigationUpdate(): void {
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        const nav = document.querySelector('header');
        if (nav) {
          nav.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease';
        }
      });
    }
  }
  initialize(): void {
    // Navigation animations are now handled in constructor
    // This method can be used for other initialization if needed
  }
  setActiveSection(section: NavigationSection): void {
    this._activeSection.set(section);
  }
  async scrollToSection(targetId: string): Promise<void> {
    const element = document.getElementById(targetId);
    if (!element) {
      console.warn(`Section ${targetId} not found`);
      return;
    }
    
    element.classList.add('scroll-fade-in');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    
    // Use timer instead of setTimeout
    timer(200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        element.classList.add('section-reveal', 'animate');
        element.focus({ preventScroll: true });
      });
  }
  async addClickAnimation(itemId: string): Promise<void> {
    const navItem = document.querySelector(`[data-nav-id="${itemId}"]`);
    if (!navItem) return;
    
    navItem.classList.add('nav-menu-item-hover');
    
    return new Promise(resolve => {
      timer(300)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          navItem.classList.remove('nav-menu-item-hover');
          resolve();
        });
    });
  }
  findItemByTarget(targetId: string): NavigationItem | undefined {
    return this._navigationItems().find(item => item.targetId === targetId);
  }
  destroy(): void {
    // Cancel any pending navigation update
    this._pendingNavUpdate.set(false);
  }
  private addNavigationAnimations(): void {
    const nav = document.querySelector('header nav');
    const logo = document.querySelector('.nav-logo');
    nav?.classList.add('nav-fade-enter');
    logo?.classList.add('nav-logo-glow');
  }
}
