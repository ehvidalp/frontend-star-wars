import { Component, inject, viewChild, ElementRef, afterNextRender, OnDestroy, ChangeDetectionStrategy, signal, computed, DestroyRef } from '@angular/core';
import { SmartNavigationService } from '@core/services/smart-navigation';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent',
  }
})
export class Welcome implements OnDestroy {
  private readonly navigationService = inject(SmartNavigationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly welcomeElement = viewChild.required<ElementRef<HTMLElement>>('welcomeSection');
  readonly titleElement = viewChild<ElementRef<HTMLElement>>('titleElement');
  
  private observer?: IntersectionObserver;
  private lastVisibleState?: boolean;
  
  private static hasAnimated = false;
  
  readonly isLoaded = signal(false);
  readonly showContent = signal(false);
  readonly animationPhase = signal<'entrance' | 'loaded' | 'static'>('entrance');
  
  readonly starwars = {
    title: 'DISCOVER THE LEGENDARY WORLDS THAT CHANGED GALATIC HISTORY',
    subtitle: 'Journey through the cosmos and explore iconic planets',
    loadingText: 'LOADING GALACTIC DATABASE...',
    exploreText: 'EXPLORE WORLDS'
  };
  
  readonly titleClasses = computed(() => {
    const baseClasses = 'font-star-wars text-cyan-400 tracking-wider leading-tight uppercase text-center transform-gpu';
    const sizeClasses = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';
    const perspectiveClasses = '[transform-style:preserve-3d] [transform-origin:center_bottom]';
    const shadowClasses = '[text-shadow:0_0_10px_#22d3ee,0_0_20px_#22d3ee,0_0_30px_#22d3ee,2px_2px_0px_#0891b2,4px_4px_0px_#0e7490]';
    const staticTransformClasses = '[transform:perspective(800px)_rotateX(15deg)]';
    
    const phase = this.animationPhase();
    
    if (phase === 'static') {
      return `${baseClasses} ${sizeClasses} ${perspectiveClasses} ${shadowClasses} ${staticTransformClasses} animate-title-perspective-glow`;
    }
    
    return `${baseClasses} ${sizeClasses} ${perspectiveClasses} ${shadowClasses} ${staticTransformClasses} animate-star-wars-complete`;
  });
  
  readonly subtitleClasses = computed(() => {
    const baseClasses = 'font-orbitron font-normal text-cyan-300 tracking-widest text-center mt-8 transform-gpu';
    const sizeClasses = 'text-base sm:text-lg md:text-xl lg:text-2xl';
    const transformClasses = '[transform:perspective(800px)_rotateX(10deg)] [transform-origin:center_bottom]';
    const shadowClasses = '[text-shadow:0_0_10px_#67e8f9]';
    
    const phase = this.animationPhase();
    
    if (phase === 'static') {
      return `${baseClasses} ${sizeClasses} ${transformClasses} ${shadowClasses}`;
    }
    
    const effectClasses = 'opacity-0 animate-subtitle-entrance';
    return `${baseClasses} ${sizeClasses} ${effectClasses} ${transformClasses} ${shadowClasses}`;
  });
  
  readonly scrollButtonClasses = computed(() => {
    const baseClasses = 'group mt-12 mx-auto px-6 py-3 border-2 border-cyan-400 bg-transparent text-cyan-400 font-orbitron tracking-wider uppercase transform-gpu transition-all duration-300';
    const hoverClasses = 'hover:bg-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-400/50 hover:animate-button-glow';
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent';
    const transformClasses = '[transform:perspective(800px)_rotateX(5deg)] [transform-origin:center_bottom]';
    const shadowClasses = '[text-shadow:0_0_5px_currentColor]';
    
    const phase = this.animationPhase();
    
    if (phase === 'static') {
      return `${baseClasses} ${hoverClasses} ${focusClasses} ${transformClasses} ${shadowClasses} flex items-center justify-center`;
    }
    
    const effectClasses = 'opacity-0 animate-star-wars-button-entrance';
    return `${baseClasses} ${hoverClasses} ${focusClasses} ${effectClasses} ${transformClasses} ${shadowClasses} flex items-center justify-center`;
  });

  constructor() {
    afterNextRender(() => {
      this.setupVisibilityObserver();
      this.initializeAnimations();
    });
  }
  
  private initializeAnimations(): void {
    this.showContent.set(true);
    
    if (!Welcome.hasAnimated) {
      this.animationPhase.set('entrance');
      Welcome.hasAnimated = true;
      
      timer(6000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.animationPhase.set('static');
        });
    } else {
      this.animationPhase.set('static');
    }
    
    this.isLoaded.set(true);
  }
  
  private setupVisibilityObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    
    this.navigationService.setWelcomeVisibility(true);
    this.lastVisibleState = true;
    
    const element = this.welcomeElement().nativeElement;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.3;
        
        if (this.lastVisibleState !== isVisible) {
          this.lastVisibleState = isVisible;
          
          timer(50)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.navigationService.setWelcomeVisibility(isVisible);
            });
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.3, 0.5, 0.7, 1]
      }
    );
    
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.navigationService.setWelcomeVisibility(false);
  }
  
  scrollToPlanets(): void {
    const planetsSection = document.getElementById('planets-list-section');
    if (planetsSection) {
      planetsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
