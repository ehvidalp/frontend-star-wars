import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '../../models/navigation.model';

/**
 * Navigation Menu Component - VERSIÓN DEFINITIVA
 * 
 * ✅ CERO function calls en template (máxima performance)
 * ✅ Enriched Data Pattern (Angular 20 best practice)
 * ✅ Computed properties con memoización automática
 * ✅ OnPush change detection strategy
 * 
 * ENFOQUE: Pre-compute all styles in computed property,
 * template only does direct property access O(1)
 * 
 * TRADE-OFF: Complexity vs Performance - Optimized for scale
 */

interface EnrichedNavigationItem extends NavigationItem {
  // Estilos pre-calculados para evitar function calls en template
  buttonClasses: string;
  textClasses: string;
  accentClasses: string;
  isActive: boolean;
}
@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-menu.html',
  styleUrl: './navigation-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block'
  }
})
export class NavigationMenuComponent {
  // Signal-based inputs
  navigationItems = input.required<NavigationItem[]>();
  activeSection = input.required<string>();
  variant = input<'desktop' | 'mobile'>('desktop');

  // Signal-based output
  navigate = output<NavigationItem>();

  // ✅ Computed properties para valores reutilizados
  readonly isMobile = computed(() => this.variant() === 'mobile');
  readonly isDesktop = computed(() => !this.isMobile());

  // ✅ Computed para clases que se reutilizan
  readonly containerClasses = computed(() => 
    `flex ${this.isMobile() ? 'flex-col space-y-2' : 'flex-row space-x-6'}`
  );

  readonly listItemClass = computed(() => 
    this.isMobile() ? 'block' : 'inline-block'
  );

  readonly baseButtonClasses = computed(() => {
    const base = 'group relative font-orbitron font-medium uppercase tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-cyan-400/80 hover:text-cyan-300 border-none bg-transparent cursor-pointer';
    const variant = this.isMobile() 
      ? 'w-full py-3 text-base text-left border-b border-cyan-400/10 rounded-lg hover:bg-cyan-400/5'
      : 'px-4 py-2 text-sm';
    return `${base} ${variant}`;
  });

  readonly baseTextClasses = computed(() => {
    const base = 'relative z-10 transition-all duration-300';
    const glow = this.isDesktop() 
      ? ' drop-shadow-[0_0_6px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]'
      : '';
    return `${base}${glow}`;
  });

  readonly baseAccentClasses = computed(() => {
    const base = 'absolute h-0.5 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out shadow-[0_0_6px_rgba(34,211,238,0.8)]';
    const position = this.isDesktop() 
      ? ' left-1/2 transform -translate-x-1/2'
      : ' left-0';
    return `${base}${position}`;
  });

  // ✅ SOLUCIÓN DEFINITIVA: Array de items enriquecidos
  // Solo property access en template, CERO function calls
  readonly enrichedNavigationItems = computed((): EnrichedNavigationItem[] => {
    const items = this.navigationItems();
    const activeSection = this.activeSection();
    const baseButton = this.baseButtonClasses();
    const baseText = this.baseTextClasses();
    const baseAccent = this.baseAccentClasses();
    
    return items.map(item => {
      const isActive = activeSection === item.id;
      
      return {
        ...item,
        buttonClasses: isActive 
          ? `${baseButton}${this.isMobile() ? ' text-cyan-300 bg-cyan-400/10' : ' text-cyan-300'}`
          : baseButton,
        textClasses: isActive && this.isDesktop()
          ? `${baseText} drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]`
          : baseText,
        accentClasses: isActive
          ? `${baseAccent}${this.isMobile() ? ' w-full' : ' w-3/4'}`
          : `${baseAccent} w-0 group-hover:w-full group-focus:w-full`,
        isActive
      };
    });
  });

  // Event handlers
  onNavigate(item: NavigationItem): void {
    this.navigate.emit(item);
  }

  onKeyboardNavigate(event: KeyboardEvent, item: NavigationItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onNavigate(item);
    }
  }
}
