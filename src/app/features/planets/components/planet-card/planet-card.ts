import { Component, input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Planet, PlanetSummary } from '../../models/planet.model';
import { PlanetSphere } from '../planet-sphere/planet-sphere';

@Component({
  selector: 'app-planet-card',
  imports: [PlanetSphere],
  templateUrl: './planet-card.html',
  styleUrl: './planet-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetCard {
  planet = input.required<Planet>();
  
  private router = inject(Router);

  // Type guard para verificar si es PlanetSummary
  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet;
  }

  // Computed properties para view-transition-names
  cardTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-card-${planet.uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-title-${planet.uid}` : '';
  });

  /**
   * Navega a la página de detalle del planeta
   */
  onCardClick(): void {
    try {
      console.log('🚀 Planet card clicked');
      const planet = this.planet();
      console.log('🌍 Planet data:', planet);
      
      if (this.isPlanetSummary(planet)) {
        console.log('✅ Valid planet summary, navigating to:', `/planets/${planet.uid}`);
        
        // Navegar a la página de detalle
        this.router.navigate(['/planets', planet.uid]);
      } else {
        console.warn('⚠️ Planet is not a valid PlanetSummary:', planet);
      }
    } catch (error) {
      console.error('❌ Error in onCardClick:', error);
    }
  }
}
