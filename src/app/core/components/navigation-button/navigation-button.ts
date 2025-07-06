import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Navigation Button Component
 * Handles both regular navigation and back button functionality
 * Styled with Star Wars theme
 */

export interface NavigationButtonConfig {
  id: string;
  label: string;
  ariaLabel: string;
  icon?: string;
  variant: 'primary' | 'back' | 'secondary';
  isActive?: boolean;
}

@Component({
  selector: 'app-navigation-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-button.html',
  styleUrl: './navigation-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block'
  }
})
export class NavigationButtonComponent {
  // Signal-based inputs
  config = input.required<NavigationButtonConfig>();
  variant = input<'desktop' | 'mobile'>('desktop');
  disabled = input<boolean>(false);

  // Signal-based output
  buttonClick = output<NavigationButtonConfig>();

  // Computed classes based on configuration
  readonly buttonClasses = computed(() => {
    const config = this.config();
    const variant = this.variant();
    const disabled = this.disabled();
    
    // Base classes
    const baseClasses = 'group relative font-orbitron font-medium uppercase tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border-none bg-transparent cursor-pointer';
    
    // Variant-specific classes
    const variantClasses = variant === 'mobile' 
      ? 'w-full py-3 text-base text-left border-b border-cyan-400/10 rounded-lg hover:bg-cyan-400/5'
      : 'px-4 py-2 text-sm';
    
    // Button type classes
    const typeClasses = this.getTypeClasses(config.variant, config.isActive);
    
    // Disabled classes
    const disabledClasses = disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:text-cyan-300';
    
    return `${baseClasses} ${variantClasses} ${typeClasses} ${disabledClasses}`;
  });

  readonly textClasses = computed(() => {
    const config = this.config();
    const variant = this.variant();
    const isActive = config.isActive;
    
    const baseClasses = 'relative z-10 transition-all duration-300';
    
    // Desktop glow effect
    const glowClasses = variant === 'desktop' 
      ? ' drop-shadow-[0_0_6px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]'
      : '';
    
    // Active state glow
    const activeGlow = isActive && variant === 'desktop' 
      ? ' drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]'
      : '';
    
    return `${baseClasses}${glowClasses}${activeGlow}`;
  });

  readonly accentClasses = computed(() => {
    const config = this.config();
    const variant = this.variant();
    const isActive = config.isActive;
    
    const baseClasses = 'absolute h-0.5 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ease-out shadow-[0_0_6px_rgba(34,211,238,0.8)]';
    
    // Position based on variant
    const positionClasses = variant === 'desktop' 
      ? ' left-1/2 transform -translate-x-1/2'
      : ' left-0';
    
    // Width based on state
    const widthClasses = isActive
      ? (variant === 'desktop' ? ' w-3/4' : ' w-full')
      : ' w-0 group-hover:w-full group-focus:w-full';
    
    return `${baseClasses}${positionClasses}${widthClasses}`;
  });

  readonly iconClasses = computed(() => {
    const config = this.config();
    const baseClasses = 'inline-block transition-all duration-300';
    
    // Back button specific styling
    if (config.variant === 'back') {
      return `${baseClasses} mr-2 group-hover:transform group-hover:-translate-x-1`;
    }
    
    return `${baseClasses} ml-2`;
  });

  private getTypeClasses(type: string, isActive = false): string {
    switch (type) {
      case 'back':
        return 'text-amber-400/80 hover:text-amber-300' + (isActive ? ' text-amber-300' : '');
      case 'secondary':
        return 'text-purple-400/80 hover:text-purple-300' + (isActive ? ' text-purple-300' : '');
      case 'primary':
      default:
        return 'text-cyan-400/80 hover:text-cyan-300' + (isActive ? ' text-cyan-300' : '');
    }
  }

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit(this.config());
    }
  }

  onKeyboardClick(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onButtonClick();
    }
  }
}
