import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '../../models/navigation.model';

/**
 * Navigation Menu Component
 * Reusable navigation component for desktop and mobile variants
 * Uses Tailwind v4 architecture with computed properties for optimal performance
 */
@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-menu.html',
  styleUrl: './navigation-menu.css',
  host: {
    class: 'inline-block'
  }
})
export class NavigationMenuComponent {
  // Signal-based inputs (Angular 17+ API)
  navigationItems = input.required<NavigationItem[]>();
  activeSection = input.required<string>();
  variant = input<'desktop' | 'mobile'>('desktop');

  // Signal-based output
  navigate = output<NavigationItem>();

  // Style configuration objects
  private readonly styleConfig = {
    base: {
      button: 'group relative font-orbitron font-medium uppercase tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-cyan-400/80 hover:text-cyan-300 border-none bg-transparent cursor-pointer',
      text: 'relative z-10 transition-all duration-300',
      accent: 'absolute h-0.5 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out shadow-[0_0_6px_rgba(34,211,238,0.8)] w-0 group-hover:w-full group-focus:w-full'
    },
    variants: {
      desktop: {
        button: 'px-4 py-2 text-sm',
        text: 'drop-shadow-[0_0_6px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]',
        accent: 'left-1/2 transform -translate-x-1/2'
      },
      mobile: {
        button: 'w-full py-3 text-base text-left border-b border-cyan-400/10 rounded-lg hover:bg-cyan-400/5',
        text: '',
        accent: 'left-0'
      }
    },
    active: {
      button: 'text-cyan-300',
      desktop: {
        text: 'drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]',
        accent: 'w-3/4'
      },
      mobile: {
        button: 'bg-cyan-400/10',
        accent: 'w-full'
      }
    }
  } as const;

  // Computed properties for optimized class generation
  readonly buttonClasses = computed(() => {
    const variant = this.variant();
    const base = this.styleConfig.base.button;
    const variantClasses = this.styleConfig.variants[variant].button;
    
    return `${base} ${variantClasses}`;
  });

  readonly textClasses = computed(() => {
    const variant = this.variant();
    const base = this.styleConfig.base.text;
    const variantClasses = this.styleConfig.variants[variant].text;
    
    return `${base} ${variantClasses}`;
  });

  readonly accentClasses = computed(() => {
    const variant = this.variant();
    const base = this.styleConfig.base.accent;
    const variantClasses = this.styleConfig.variants[variant].accent;
    
    return `${base} ${variantClasses}`;
  });

  // Helper functions defined outside computed (better performance)
  private getActiveButtonClasses(isActive: boolean, variant: string): string {
    if (!isActive) return '';
    return variant === 'mobile' 
      ? ' text-cyan-300 bg-cyan-400/10'
      : ' text-cyan-300';
  }
  
  private getActiveTextClasses(isActive: boolean, variant: string): string {
    return (isActive && variant === 'desktop') 
      ? ' drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]'
      : '';
  }
  
  private getActiveAccentClasses(isActive: boolean, variant: string): string {
    if (!isActive) return '';
    return variant === 'desktop' ? ' w-3/4' : ' w-full';
  }

  // Computed properties for item-specific classes (optimized for template usage)
  readonly itemStyles = computed(() => {
    const items = this.navigationItems();
    const activeSection = this.activeSection();
    const variant = this.variant();
    const buttonBase = this.buttonClasses();
    const textBase = this.textClasses();
    const accentBase = this.accentClasses();
    
    // Return plain object instead of Map (more performant for Angular)
    return items.reduce((acc, item) => {
      const isActive = activeSection === item.id;
      
      acc[item.id] = {
        button: buttonBase + this.getActiveButtonClasses(isActive, variant),
        text: textBase + this.getActiveTextClasses(isActive, variant),
        accent: accentBase + this.getActiveAccentClasses(isActive, variant),
        isActive // ✅ Añadir estado activo para el template
      };
      
      return acc;
    }, {} as Record<string, { button: string; text: string; accent: string; isActive: boolean }>);
  });

  /**
   * Handle navigation item click
   */
  onNavigate(item: NavigationItem): void {
    this.navigate.emit(item);
  }
}
