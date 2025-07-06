import { Directive, input, inject, computed, ChangeDetectorRef, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';

@Directive({
  selector: '[appPlanetCard]',
  standalone: true
})
export class PlanetCardDirective implements OnInit, OnDestroy {
  planet = input.required<Planet>();
  
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  
  private clickListener?: () => void;
  private keydownListener?: (event: KeyboardEvent) => void;

  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  }

  cardTransitionName = computed(() => {
    const planet = this.planet();
    return 'uid' in planet ? `planet-card-${planet.uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return 'uid' in planet ? `planet-title-${planet.uid}` : '';
  });

  ngOnInit(): void {
    this.setupElement();
    this.setupEventListeners();
    this.updateAttributes();
  }

  ngOnDestroy(): void {
    this.cleanupEventListeners();
  }

  private setupElement(): void {
    const element = this.elementRef.nativeElement;
    
    // Agregar clases CSS para el estilo de la card
    const cardClasses = [
      'planet-card', 'relative', 'w-full', 'h-full', 'min-h-[20rem]', 'max-w-sm', 'mx-auto',
      'bg-gradient-to-br', 'from-slate-900/60', 'via-blue-950/40', 'to-slate-800/50',
      'backdrop-blur-sm', 'border', 'border-transparent', 'bg-clip-padding', 'rounded-lg',
      'overflow-hidden', 'cursor-pointer', 'transition-all', 'duration-500', 'ease-out',
      'hover:-translate-y-2', 'hover:scale-105', 'hover:shadow-xl', 'hover:shadow-cyan-400/30',
      'hover:bg-transparent', 'hover:backdrop-blur-none', 'focus-visible:outline-2',
      'focus-visible:outline-cyan-400/60', 'focus-visible:outline-offset-2',
      'will-change-transform', 'group',
      'before:content-[\'\']', 'before:absolute', 'before:inset-0', 'before:p-[1px]',
      'before:bg-gradient-to-r', 'before:from-cyan-400/50', 'before:via-blue-500/60',
      'before:to-purple-600/50', 'before:rounded-lg', 'before:-z-10', 'before:transition-all',
      'before:duration-700', 'before:opacity-40', 'hover:before:opacity-70'
    ];
    
    cardClasses.forEach(cls => {
      this.renderer.addClass(element, cls);
    });

    // Hacer el elemento focusable si no lo es
    if (!element.hasAttribute('tabindex')) {
      this.renderer.setAttribute(element, 'tabindex', '0');
    }

    // Establecer rol de button si no es un button
    if (element.tagName.toLowerCase() !== 'button') {
      this.renderer.setAttribute(element, 'role', 'button');
    }
  }

  private setupEventListeners(): void {
    const element = this.elementRef.nativeElement;
    
    // Listener para click
    this.clickListener = () => this.onCardClick();
    this.renderer.listen(element, 'click', this.clickListener);
    
    // Listener para teclado (Enter y Space)
    this.keydownListener = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.onCardClick();
      }
    };
    this.renderer.listen(element, 'keydown', this.keydownListener);
  }

  private cleanupEventListeners(): void {
    // Los listeners se limpian automáticamente con Renderer2
    this.clickListener = undefined;
    this.keydownListener = undefined;
  }

  private updateAttributes(): void {
    const element = this.elementRef.nativeElement;
    const planet = this.planet();
    const planetName = planet?.name || 'unknown';
    
    // Actualizar atributos de accesibilidad
    this.renderer.setAttribute(element, 'aria-label', `View details for planet ${planetName}`);
    this.renderer.setAttribute(element, 'aria-describedby', `planet-info-${planetName}`);
    this.renderer.setAttribute(element, 'data-planet-name', planetName);
    
    // Actualizar view transition name
    const transitionName = this.cardTransitionName();
    if (transitionName) {
      this.renderer.setStyle(element, 'view-transition-name', transitionName);
    }
  }

  private onCardClick(): void {
    try {
      const planet = this.planet();
      if ('uid' in planet) {
        this.router.navigate(['/planets', planet.uid]);
      } else {
        console.warn('⚠️ Planet does not have uid:', planet);
      }
    } catch (error) {
      console.error('❌ Error in onCardClick:', error);
    }
  }
}
