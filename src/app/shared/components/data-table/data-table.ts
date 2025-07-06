import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export interface DataField {
  label: string;
  value: string;
  key?: string;
}

export interface DataSection {
  title?: string;
  fields: DataField[];
  variant?: 'card' | 'detail' | 'compact';
}

@Component({
  selector: 'app-data-table',
  template: `
    <div [class]="containerClasses()">
      @if (section().title) {
        <h3 [class]="titleClasses()">
          {{ section().title }}
        </h3>
      }
      <div [class]="fieldsContainerClasses()">
        @for (field of section().fields; track field.key || field.label) {
          <div [class]="fieldClasses()">
            <span [class]="labelClasses()">{{ field.label }}</span>
            <span [class]="valueClasses()">{{ field.value }}</span>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DataTable {
  section = input.required<DataSection>();
  variant = input<'card' | 'detail' | 'compact'>('detail');
  
  private readonly baseContainerClasses = 'bg-transparent backdrop-blur-sm rounded-lg border border-cyan-400/15 transition-all duration-500';
  private readonly baseFieldClasses = 'grid grid-cols-[1fr_auto] gap-6 items-center';
  private readonly baseLabelClasses = 'text-cyan-400/80 font-semibold text-sm uppercase tracking-wide';
  private readonly baseValueClasses = 'text-cyan-100 font-mono text-base';
  
  containerClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = this.baseContainerClasses;
    
    switch (variant) {
      case 'card':
        return `${baseClasses} p-3 group-hover:border-cyan-400/30 group-hover:bg-slate-900/10`;
      case 'detail':
        return `${baseClasses} p-6 border-cyan-400/20 hover:border-cyan-400/30 hover:bg-slate-900/10`;
      case 'compact':
        return `${baseClasses} p-2 border-cyan-400/10`;
      default:
        return baseClasses;
    }
  });
  
  titleClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = 'font-orbitron font-bold text-cyan-400 border-b border-cyan-400/30 pb-2';
    
    switch (variant) {
      case 'card':
        return `${baseClasses} text-sm mb-3`;
      case 'detail':
        return `${baseClasses} text-xl mb-6`;
      case 'compact':
        return `${baseClasses} text-xs mb-2`;
      default:
        return baseClasses;
    }
  });
  
  fieldsContainerClasses = computed(() => {
    const variant = this.variant();
    
    switch (variant) {
      case 'card':
        return 'space-y-2';
      case 'detail':
        return 'space-y-4';
      case 'compact':
        return 'space-y-1';
      default:
        return 'space-y-4';
    }
  });
  
  fieldClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = this.baseFieldClasses;
    
    switch (variant) {
      case 'card':
        return `${baseClasses} gap-3`;
      case 'detail':
        return `${baseClasses} gap-6`;
      case 'compact':
        return `${baseClasses} gap-2`;
      default:
        return baseClasses;
    }
  });
  
  labelClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = this.baseLabelClasses;
    
    switch (variant) {
      case 'card':
        return `${baseClasses} text-xs`;
      case 'detail':
        return baseClasses;
      case 'compact':
        return `${baseClasses} text-xs`;
      default:
        return baseClasses;
    }
  });
  
  valueClasses = computed(() => {
    const variant = this.variant();
    const baseClasses = this.baseValueClasses;
    
    switch (variant) {
      case 'card':
        return `${baseClasses} text-xs`;
      case 'detail':
        return baseClasses;
      case 'compact':
        return `${baseClasses} text-xs`;
      default:
        return baseClasses;
    }
  });
}
