import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationSection, NavigationTarget, NavigationItem } from '../models/navigation.model';
import { filter } from 'rxjs/operators';

/**
 * Smart Navigation Service
 * Handles navigation state, animations, and section detection
 * Optimized for simplicity while maintaining clean architecture
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  private readonly router = inject(Router);
  
  // Core navigation data
  private readonly _activeSection = signal<NavigationSection>(NavigationSection.START);
  
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

  // Public computed properties
  readonly navigationItems = computed(() => this._navigationItems());
  readonly activeSection = computed(() => this._activeSection());

  // Navigation visibility: hide ONLY when welcome section is visible on home page
  readonly shouldShowNavigation = computed(() => {
    const currentUrl = this.router.url;
    
    // If we're NOT on home page, always show navbar (with back button)
    if (currentUrl !== '/' && currentUrl !== '') {
      return true;
    }
    
    // If we're on home page, check which section is visible
    const currentSection = this._activeSection();
    
    // HIDE navbar only when welcome section is visible on home page
    // SHOW navbar when planets section is visible on home page
    return currentSection === NavigationSection.PLANETS;
  });

  private observer?: IntersectionObserver;

  constructor() {
    // Listen to route changes to reinitialize observer when needed
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // If we're back to home page, reinitialize the observer
      if (event.urlAfterRedirects === '/') {
        setTimeout(() => {
          this.reinitializeObserver();
        }, 200); // Increased timeout to ensure DOM is ready
      } else {
        // When leaving home page, set active section to START
        this._activeSection.set(NavigationSection.START);
      }
    });
  }

  /**
   * Initialize navigation system
   */
  initialize(): void {
    this.setupIntersectionObserver();
    this.addNavigationAnimations();
  }

  /**
   * Set active section
   */
  setActiveSection(section: NavigationSection): void {
    this._activeSection.set(section);
  }

  /**
   * Scroll to section with animations
   */
  async scrollToSection(targetId: string): Promise<void> {
    const element = document.getElementById(targetId);
    if (!element) {
      console.warn(`Section ${targetId} not found`);
      return;
    }

    // Add scroll animations
    element.classList.add('scroll-fade-in');
    
    // Perform scroll
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

    // Add reveal animation and focus
    setTimeout(() => {
      element.classList.add('section-reveal', 'animate');
      element.focus({ preventScroll: true });
    }, 200);
  }

  /**
   * Add click animation to navigation item
   */
  async addClickAnimation(itemId: string): Promise<void> {
    const navItem = document.querySelector(`[data-nav-id="${itemId}"]`);
    if (!navItem) return;

    navItem.classList.add('nav-menu-item-hover');
    
    return new Promise(resolve => {
      setTimeout(() => {
        navItem.classList.remove('nav-menu-item-hover');
        resolve();
      }, 300);
    });
  }

  /**
   * Find navigation item by target ID
   */
  findItemByTarget(targetId: string): NavigationItem | undefined {
    return this._navigationItems().find(item => item.targetId === targetId);
  }

  /**
   * Cleanup observer
   */
  destroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Reinitialize observer (useful when returning to home page)
   */
  private reinitializeObserver(): void {
    // Check if we're in browser environment
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    
    // Disconnect existing observer
    this.observer?.disconnect();
    
    // Reset to START section when reinitializing
    this._activeSection.set(NavigationSection.START);
    
    // Wait a bit more to ensure DOM is ready
    setTimeout(() => {
      this.setupIntersectionObserver();
      
      // Check initial visibility after setup
      this.checkInitialVisibility();
    }, 100);
  }

  /**
   * Check which section is initially visible
   */
  private checkInitialVisibility(): void {
    const welcomeElement = document.getElementById(NavigationTarget.WELCOME);
    const planetsElement = document.getElementById(NavigationTarget.PLANETS_LIST);
    
    if (welcomeElement && this.isElementInViewport(welcomeElement)) {
      this._activeSection.set(NavigationSection.START);
    } else if (planetsElement && this.isElementInViewport(planetsElement)) {
      this._activeSection.set(NavigationSection.PLANETS);
    }
  }

  /**
   * Check if element is in viewport
   */
  private isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= windowHeight &&
      rect.right <= windowWidth
    );
  }

  /**
   * Setup intersection observer for section detection
   */
  private setupIntersectionObserver(): void {
    // Check if we're in browser environment
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    // Observe target sections
    this._navigationItems().forEach(item => {
      const element = document.getElementById(item.targetId);
      if (element) {
        this.observer!.observe(element);
      }
    });
  }

  /**
   * Handle intersection changes
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = this.findItemByTarget(entry.target.id);
        if (item) {
          this.setActiveSection(item.id);
        }
        entry.target.classList.add('section-active');
      } else {
        entry.target.classList.remove('section-active');
      }
    });
  }

  /**
   * Add initial navigation animations
   */
  private addNavigationAnimations(): void {
    const nav = document.querySelector('header nav');
    const logo = document.querySelector('.nav-logo');
    
    nav?.classList.add('nav-enter');
    logo?.classList.add('nav-logo-glow');
  }
}
