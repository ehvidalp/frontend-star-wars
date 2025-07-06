import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationSection, NavigationTarget, NavigationItem } from '../models/navigation.model';

/**
 * Smart Navigation Service
 * Simple signal-based navigation state management
 * Following Angular 20 best practices
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  private readonly router = inject(Router);
  
  // Core navigation data
  private readonly _activeSection = signal<NavigationSection>(NavigationSection.START);
  private readonly _isWelcomeVisible = signal<boolean>(true); // Signal para el estado del welcome component
  
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

  // Simple navigation visibility logic - Angular 20 best practices
  readonly shouldShowNavigation = computed(() => {
    const currentUrl = this.router.url;
    
    // Simple rule: Hide navbar only on home page when welcome is visible
    if (currentUrl === '/' || currentUrl === '') {
      return !this._isWelcomeVisible(); // Show navbar when welcome is NOT visible
    }
    
    // Always show navbar on other pages (/planets, /planets/:id)
    return true;
  });

  /**
   * Set welcome component visibility
   * Called by the welcome component when it appears/disappears
   */
  setWelcomeVisibility(isVisible: boolean): void {
    this._isWelcomeVisible.set(isVisible);
  }

  /**
   * Initialize navigation system
   */
  initialize(): void {
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
   * Cleanup - no longer needed since we removed IntersectionObserver
   */
  destroy(): void {
    // No cleanup needed
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
