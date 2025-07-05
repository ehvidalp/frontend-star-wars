import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Planets } from '../../services/planets';
import { PlanetsStore } from '../../store/planets.store';

import { CommonModule } from '@angular/common';
import { PlanetCard } from '../planet-card/planet-card';
import { InfinityScrollDirective } from '../../../../shared/directives/infinity-scroll';

@Component({
  selector: 'app-planets-list',
  imports: [ CommonModule, PlanetCard, InfinityScrollDirective],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetsList implements OnInit {
  readonly planetsStore = inject(PlanetsStore);

  ngOnInit(): void {
    this.planetsStore.loadPlanets();
  }

  loadMorePlanets(): void {
    const nextUrl = this.planetsStore.nextPageUrl();
    if (nextUrl && !this.planetsStore.isLoading()) {
      console.log('Loading more planets with URL:', nextUrl);
      this.planetsStore.loadPlanets(nextUrl);
    }
  }

  /**
   * Track by function optimizado para ngFor
   * Usa uid si está disponible (PlanetSummary), sino el name
   */
  trackByPlanet(index: number, planet: any): string {
    // Para PlanetSummary usar uid que es único
    if (planet.uid) {
      return planet.uid;
    }
    // Para otros casos usar name + index para evitar duplicados
    return `${planet.name || 'unknown'}-${index}`;
  }
}
