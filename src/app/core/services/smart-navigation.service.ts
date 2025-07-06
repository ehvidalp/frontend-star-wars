import { Injectable, signal, computed } from '@angular/core';
import { NavigationSection, NavigationTarget, NavigationItem } from '../models/navigation.model';

/**
 * Smart Navigation Service
 * Handles navigation state, animations, and section detection
 * Optimized for simplicity while maintaining clean architecture
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  
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

  private observer?: IntersectionObserver;

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
   * Setup intersection observer for section detection
   */
  private setupIntersectionObserver(): void {
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
