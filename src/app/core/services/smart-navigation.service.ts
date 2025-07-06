import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationSection, NavigationTarget, NavigationItem } from '@core/models/navigation.model';
@Injectable({
  providedIn: 'root'
})
export class SmartNavigationService {
  private readonly router = inject(Router);
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
  readonly navigationItems = computed(() => this._navigationItems());
  readonly activeSection = computed(() => this._activeSection());
  readonly shouldShowNavigation = computed(() => {
    const currentUrl = this.router.url;
    if (currentUrl === '/' || currentUrl === '') {
      return !this._isWelcomeVisible(); // Show navbar when welcome is NOT visible
    }
    return true;
  });
  setWelcomeVisibility(isVisible: boolean): void {
    this._isWelcomeVisible.set(isVisible);
  }
  initialize(): void {
    this.addNavigationAnimations();
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
    setTimeout(() => {
      element.classList.add('section-reveal', 'animate');
      element.focus({ preventScroll: true });
    }, 200);
  }
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
  findItemByTarget(targetId: string): NavigationItem | undefined {
    return this._navigationItems().find(item => item.targetId === targetId);
  }
  destroy(): void {
  }
  private addNavigationAnimations(): void {
    const nav = document.querySelector('header nav');
    const logo = document.querySelector('.nav-logo');
    nav?.classList.add('nav-enter');
    logo?.classList.add('nav-logo-glow');
  }
}
