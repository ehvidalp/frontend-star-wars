import { Component, inject, viewChild, ElementRef, afterNextRender, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SmartNavigationService } from '@core/services/smart-navigation.service';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'min-h-screen w-full flex flex-col items-center justify-center',
  }
})
export class Welcome implements OnDestroy {
  private readonly navigationService = inject(SmartNavigationService);
  readonly welcomeElement = viewChild.required<ElementRef<HTMLElement>>('welcomeSection');
  private observer?: IntersectionObserver;
  constructor() {
    this.navigationService.setWelcomeVisibility(true);
    afterNextRender(() => {
      this.setupVisibilityObserver();
    });
  }
  private setupVisibilityObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const element = this.welcomeElement().nativeElement;
    this.observer = new IntersectionObserver(
      ([entry]) => {
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
    this.navigationService.setWelcomeVisibility(false);
  }
}
