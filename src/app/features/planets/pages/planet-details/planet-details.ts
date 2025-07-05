import { Component, input, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetsStore } from '../../store/planets.store';
import { Planet, PlanetSummary } from '../../models/planet.model';

@Component({
  selector: 'app-planet-details',
  imports: [],
  templateUrl: './planet-details.html',
  styleUrl: './planet-details.css'
})
export class PlanetDetails implements OnInit {
  planetId = input.required<string>();
  
  private planetsStore = inject(PlanetsStore);
  private router = inject(Router);

  // Computed para obtener el planeta por ID
  planet = computed(() => {
    const planets = this.planetsStore.planets();
    return planets.find(p => 
      'uid' in p && (p as PlanetSummary).uid === this.planetId()
    ) || null;
  });

  // Computed para obtener el UID de forma segura
  planetUid = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? (planet as PlanetSummary).uid : 'N/A';
  });

  // Computed para view-transition-names
  cardTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-card-${(planet as PlanetSummary).uid}` : '';
  });

  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-sphere-${(planet as PlanetSummary).uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-title-${(planet as PlanetSummary).uid}` : '';
  });

  ngOnInit(): void {
    // Si no hay planetas cargados, cargar la primera página
    if (this.planetsStore.planets().length === 0) {
      this.planetsStore.loadPlanets();
    }
  }

  /**
   * Navega de vuelta a la lista de planetas
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
