import { Component, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Planet, PlanetSummary } from '../../models/planet.model';
import { PlanetSphereComponent } from '../planet-sphere';

@Component({
  selector: 'app-planet-card',
  imports: [PlanetSphereComponent],
  templateUrl: './planet-card.html',
  styleUrl: './planet-card.css'
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

  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-sphere-${planet.uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return this.isPlanetSummary(planet) ? `planet-title-${planet.uid}` : '';
  });

  /**
   * Navega a la página de detalle del planeta
   */
  onCardClick(): void {
    const planet = this.planet();
    if (this.isPlanetSummary(planet)) {
      this.router.navigate(['/planets', planet.uid]);
    }
  }
}
