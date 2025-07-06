import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationButtonConfig } from '../../models/navigation.model';

/**
 * Navigation Button Component
 * Handles both regular navigation and back button functionality
 * Styled with Star Wars theme
 */

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
    
    // Use global CSS classes from /src/styles/components/_buttons.css
    let classes = 'btn-base';
    
    // Add navigation-specific classes
    switch (config.variant) {
      case 'primary':
        classes += ' btn-nav-primary nav-focus-primary';
        break;
      case 'back':
        classes += ' btn-nav-back nav-focus-back';
        break;
      case 'secondary':
        classes += ' btn-nav-secondary nav-focus-secondary';
        break;
      default:
        classes += ' btn-nav-primary nav-focus-primary';
    }
    
    // Add variant-specific classes
    if (variant === 'mobile') {
      classes += ' w-full text-left';
    }
    
    // Add active state
    if (config.isActive) {
      classes += ' btn-jedi';
    }
    
    return classes;
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
