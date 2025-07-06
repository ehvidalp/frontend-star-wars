import { Injectable, signal, computed, inject, DestroyRef, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NavigationSection, NavigationTarget, NavigationItem } from '@core/models/navigation.model';

@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  
  // Signals for reactive state management
  private readonly _activeSection = signal<NavigationSection>(NavigationSection.START);
  private readonly _isWelcomeVisible = signal<boolean>(true);
  private readonly _navigationVisible = signal<boolean>(false);
  
  // Subject for debounced navigation updates
  private readonly navigationUpdateSubject = new Subject<void>();

  constructor() {
    afterNextRender(() => {
      this.initializeNavigationAnimations();
      this.setupNavigationUpdates();
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

  // Computed properties for reactive UI updates
  readonly navigationItems = computed(() => this._navigationItems());
  readonly activeSection = computed(() => this._activeSection());
  readonly shouldShowNavigation = computed(() => {
    const currentUrl = this.router.url;
    const isWelcomeVisible = this._isWelcomeVisible();
    const navigationVisible = this._navigationVisible();
    
    if (currentUrl === '/' || currentUrl === '') {
      return !isWelcomeVisible && navigationVisible;
    }
    
    return true;
  });

  setWelcomeVisibility(isVisible: boolean): void {
    if (this._isWelcomeVisible() === isVisible) {
      return; // Avoid unnecessary updates
    }
    
    this._isWelcomeVisible.set(isVisible);
    
    if (isVisible) {
      this._navigationVisible.set(false);
    } else {
      // Use debounced timer for smoother transitions
      timer(150)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this._navigationVisible.set(true);
          this.navigationUpdateSubject.next();
        });
    }
  }

  private setupNavigationUpdates(): void {
    // Debounced navigation updates for better performance
    this.navigationUpdateSubject.pipe(
      debounceTime(50),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateNavigationStyles();
    });
  }

  private updateNavigationStyles(): void {
    requestAnimationFrame(() => {
      const nav = document.querySelector('header');
      if (nav) {
        nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out';
        nav.style.willChange = 'transform, opacity';
      }
    });
  }

  initialize(): void {
    // Initialize navigation state
    this._activeSection.set(NavigationSection.START);
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

    // Add smooth scroll animation
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

    // Add visual feedback with debounced timer
    timer(100)
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

  private initializeNavigationAnimations(): void {
    const nav = document.querySelector('header');
    const logo = document.querySelector('.nav-logo');

    if (nav) {
      // Set initial state
      nav.style.transform = 'translateY(-20px)';
      nav.style.opacity = '0';
      nav.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease-out';

      // Animate in with proper timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          nav.style.transform = 'translateY(0)';
          nav.style.opacity = '1';
        });
      });
    }

    if (logo) {
      logo.classList.add('nav-logo-glow');
    }
  }
}
