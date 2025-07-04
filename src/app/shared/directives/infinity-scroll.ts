import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfinityScroll]',
  standalone: true,
})
export class InfinityScrollDirective implements OnInit, OnDestroy {
  readonly isLoading = input<boolean>(false);
  readonly rootMargin = input<string>('200px 0px 0px 0px');
  readonly scrolledToEnd = output<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.setupObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupObserver(): void {
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