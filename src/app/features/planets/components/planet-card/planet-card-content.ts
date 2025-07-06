import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';
import { PlanetSphere } from '@features/planets/components/planet-sphere/planet-sphere';

@Component({
  selector: 'app-planet-card-content',
  imports: [PlanetSphere],
  template: `
    <!-- Corner decorations -->
    <div class="absolute top-3 left-3 w-2 h-2 border-l border-t border-cyan-400/30 transition-all duration-500 group-hover:border-cyan-400/60 group-hover:w-3 group-hover:h-3" aria-hidden="true"></div>
    <div class="absolute top-3 right-3 w-2 h-2 border-r border-t border-cyan-400/30 transition-all duration-500 group-hover:border-cyan-400/60 group-hover:w-3 group-hover:h-3" aria-hidden="true"></div>
    <div class="absolute bottom-3 left-3 w-2 h-2 border-l border-b border-cyan-400/30 transition-all duration-500 group-hover:border-cyan-400/60 group-hover:w-3 group-hover:h-3" aria-hidden="true"></div>
    <div class="absolute bottom-3 right-3 w-2 h-2 border-r border-b border-cyan-400/30 transition-all duration-500 group-hover:border-cyan-400/60 group-hover:w-3 group-hover:h-3" aria-hidden="true"></div>
    
    <!-- Background effect -->
    <div class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" aria-hidden="true">
      <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    </div>
    
    <!-- Main content -->
    <main class="bg-gradient-to-b from-transparent via-slate-900/10 to-transparent relative z-20 flex flex-col justify-center items-center h-full p-6 group-hover:bg-transparent transition-all duration-500">
      <figure class="mb-4 sm:mb-6 lg:mb-8" [attr.aria-label]="'Visual representation of ' + (planet().name || 'unknown planet')">
        <app-planet-sphere 
          [planet]="planet()" 
          size="medium">
        </app-planet-sphere>
      </figure>
      
      <section class="text-center relative" [style.view-transition-name]="titleTransitionName()">
        <h3 class="font-orbitron text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400 uppercase tracking-widest relative drop-shadow-lg transition-all duration-500 before:content-[''] before:absolute before:bottom-[-0.5rem] before:left-1/2 before:w-16 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-cyan-400 before:to-transparent before:transform before:-translate-x-1/2 before:opacity-0 before:shadow-sm before:shadow-cyan-400/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:animate-pulse group-hover:before:scale-x-125 group-hover:before:opacity-100 group-hover:before:via-cyan-300 group-hover:text-cyan-300"
            [attr.id]="'planet-info-' + (planet().name || 'unknown')"
            style="text-shadow: 0 0 10px rgb(34 211 238 / 0.8), 0 0 20px rgb(34 211 238 / 0.4), 0 0 30px rgb(34 211 238 / 0.4), 0 2px 4px rgb(0 0 0 / 0.5); filter: brightness(1.2);">
          {{ planet().name || 'Loading...' }}
        </h3>
      </section>
    </main>
    
    <!-- Screen reader content -->
    <span class="sr-only">
      Press Enter or Space to view detailed information about {{ planet().name || 'this planet' }}
    </span>
  `,
  styleUrl: './planet-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PlanetCardContent {
  planet = input.required<Planet>();

  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet && !('climate' in planet);
  }

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return 'uid' in planet ? `planet-title-${planet.uid}` : '';
  });
}
