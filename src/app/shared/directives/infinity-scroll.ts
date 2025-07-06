import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Directive({
  selector: '[appInfinityScroll]',
  standalone: true,
})
export class InfinityScrollDirective implements OnInit, OnDestroy {
  readonly isLoading = input<boolean>(false);
  readonly rootMargin = input<string>('200px 0px 0px 0px');
  readonly scrolledToEnd = output<void>();
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupObserver();
    }
  }
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  private setupObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const options = {
      root: null,
      rootMargin: this.rootMargin(),
      threshold: 0.1
    };
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading()) this.scrolledToEnd.emit()
    }, options);
    this.observer.observe(this.elementRef.nativeElement);
  }
}