import { Component, inject, viewChild, ElementRef, afterNextRender, OnDestroy } from '@angular/core';
import { SmartNavigationService } from '../../../../core/services/smart-navigation.service';

/**
 * Welcome Component - Angular 20 Best Practices
 * Simple visibility tracking with IntersectionObserver
 */
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.html',
  host: {
    class: 'min-h-screen w-full flex flex-col items-center justify-center',
  },
  styleUrl: './welcome.css'
})
export class Welcome implements OnDestroy {
  private readonly navigationService = inject(SmartNavigationService);
  
  // Angular 20 viewChild signal
  readonly welcomeElement = viewChild.required<ElementRef<HTMLElement>>('welcomeSection');
  
  private observer?: IntersectionObserver;

  constructor() {
    // Initially set welcome as visible (we're on home page)
    this.navigationService.setWelcomeVisibility(true);
    
    // Setup observer after render
    afterNextRender(() => {
      this.setupVisibilityObserver();
    });
  }

  /**
   * Simple IntersectionObserver to track visibility
   */
  private setupVisibilityObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const element = this.welcomeElement().nativeElement;
    
    this.observer = new IntersectionObserver(
      ([entry]) => {
        // Simple visibility check - if any part is visible
        this.navigationService.setWelcomeVisibility(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% is visible
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    // Set welcome as not visible when component is destroyed
    this.navigationService.setWelcomeVisibility(false);
  }
}
