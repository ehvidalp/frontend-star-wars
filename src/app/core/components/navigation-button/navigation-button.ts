import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationButtonConfig } from '@core/models/navigation.model';
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
  config = input.required<NavigationButtonConfig>();
  variant = input<'desktop' | 'mobile'>('desktop');
  disabled = input<boolean>(false);
  buttonClick = output<NavigationButtonConfig>();
  readonly buttonClasses = computed(() => {
    const config = this.config();
    const variant = this.variant();
    const disabled = this.disabled();
    let classes = 'btn-base';
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
    if (variant === 'mobile') {
      classes += ' w-full text-left';
    }
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
    const glowClasses = variant === 'desktop' 
      ? ' drop-shadow-[0_0_6px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]'
      : '';
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
    const positionClasses = variant === 'desktop' 
      ? ' left-1/2 transform -translate-x-1/2'
      : ' left-0';
    const widthClasses = isActive
      ? (variant === 'desktop' ? ' w-3/4' : ' w-full')
      : ' w-0 group-hover:w-full group-focus:w-full';
    return `${baseClasses}${positionClasses}${widthClasses}`;
  });
  readonly iconClasses = computed(() => {
    const config = this.config();
    const baseClasses = 'inline-block transition-all duration-300';
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
