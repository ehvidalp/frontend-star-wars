import { Component, input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';
import { PlanetSphere } from '@features/planets/components/planet-sphere/planet-sphere';
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
  isPlanetSummary(planet: Planet): planet is PlanetSummary {
    return 'uid' in planet && 'url' in planet;
  }
  cardTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-card-${planet.uid}` : '';
  });
  titleTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-title-${planet.uid}` : '';
  });
  onCardClick(): void {
    try {
      const planet = this.planet();
      if (this.isPlanetSummary(planet)) {
        this.router.navigate(['/planets', planet.uid]);
      } else {
        console.warn('⚠️ Planet is not a valid PlanetSummary:', planet);
      }
    } catch (error) {
      console.error('❌ Error in onCardClick:', error);
    }
  }
}
