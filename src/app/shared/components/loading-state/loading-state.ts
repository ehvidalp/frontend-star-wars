import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { LoadingSize, LoadingVariant } from '../../models/ui-state.model';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingState {
  size = input<LoadingSize>('medium');
  variant = input<LoadingVariant>('primary');
  ariaLabel = input<string>('Cargando');

  // Computed properties instead of methods
  readonly containerClasses = computed(() => {
    const sizeClasses = {
      small: 'py-4 sm:py-6',
      medium: 'py-8 sm:py-12',
      large: 'py-16 sm:py-24'
    };
    
    return `flex items-center justify-center ${sizeClasses[this.size()]}`;
  });

  readonly spinnerClasses = computed(() => {
    const sizeClasses = {
      small: 'h-6 w-6',
      medium: 'h-8 w-8',
      large: 'h-12 w-12'
    };
    
    const variantClasses = {
      primary: 'border-yellow-400',
      secondary: 'border-blue-400'
    };
    
    return `animate-spin rounded-full border-b-2 ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`;
  });

  readonly textClasses = computed(() => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-sm sm:text-base',
      large: 'text-lg'
    };
    
    const variantClasses = {
      primary: 'text-yellow-400',
      secondary: 'text-blue-400'
    };
    
    return `font-orbitron ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`;
  });
}
