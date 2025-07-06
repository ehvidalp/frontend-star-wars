import { Component, input, inject, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PlanetsStore } from '@features/planets/store/planets.store';
import { Planet, PlanetSummary } from '@features/planets/models/planet.model';
import { PlanetSphere } from '@features/planets/components/planet-sphere/planet-sphere';
@Component({
  selector: 'app-planet-details',
  imports: [PlanetSphere],
  templateUrl: './planet-details.html',
  styleUrl: './planet-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetDetails implements OnInit {
  planetId = input.required<string>();
  private planetsStore = inject(PlanetsStore);
  planet = computed(() => {
    const planets = this.planetsStore.planets();
    return planets.find(p => 
      'uid' in p && (p as PlanetSummary).uid === this.planetId()
    ) || null;
  });
  planetUid = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? (planet as PlanetSummary).uid : 'N/A';
  });
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
    if (this.planetsStore.planets().length === 0) {
      this.planetsStore.loadPlanets();
    }
  }
}
