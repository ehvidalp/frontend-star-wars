import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '@core/models/navigation.model';
interface EnrichedNavigationItem extends NavigationItem {
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
  navigationItems = input.required<NavigationItem[]>();
  activeSection = input.required<string>();
  variant = input<'desktop' | 'mobile'>('desktop');
  navigate = output<NavigationItem>();
  readonly isMobile = computed(() => this.variant() === 'mobile');
  readonly isDesktop = computed(() => !this.isMobile());
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
    const base = 'absolute transition-all duration-300';
    const variant = this.isMobile()
      ? 'left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.6)]'
      : 'bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]';
    return `${base} ${variant}`;
  });
  readonly enrichedNavigationItems = computed<EnrichedNavigationItem[]>(() => {
    const items = this.navigationItems();
    const active = this.activeSection();
    const baseButtonClasses = this.baseButtonClasses();
    const baseTextClasses = this.baseTextClasses();
    const baseAccentClasses = this.baseAccentClasses();
    return items.map(item => {
      const isActive = item.id === active;
      return {
        ...item,
        isActive,
        buttonClasses: `${baseButtonClasses} ${
          isActive ? 'text-cyan-300' : 'text-cyan-400/80'
        }`,
        textClasses: `${baseTextClasses} ${
          isActive ? 'text-cyan-300' : 'text-cyan-400/80'
        }`,
        accentClasses: `${baseAccentClasses} ${
          isActive
            ? this.isMobile() 
              ? 'opacity-100 scale-y-100' 
              : 'w-full opacity-100 scale-x-100'
            : this.isMobile()
              ? 'opacity-0 scale-y-0'
              : 'w-0 opacity-0 scale-x-0'
        }`
      };
    });
  });
  onNavigate(item: NavigationItem): void {
    this.navigate.emit(item);
  }
}
