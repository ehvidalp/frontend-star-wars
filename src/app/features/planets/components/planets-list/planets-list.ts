/**
 * PlanetsList Component
 * 
 * OPTIMIZACIÓN DE PERFORMANCE CON SIGNALS:
 * - Usa computed properties en lugar de funciones en el template
 * - Las computed properties se actualizan automáticamente cuando cambian los signals
 * - Evita re-evaluaciones innecesarias en cada ciclo de change detection
 * - Sigue las mejores prácticas de Angular con signals reactivos
 */

import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { Planets } from '../../services/planets';
import { PlanetsStore } from '../../store/planets.store';
import { LoadingSize } from '../../../../shared/models';

import { PlanetCard } from '../planet-card/planet-card';
import { InfinityScrollDirective } from '../../../../shared/directives/infinity-scroll';
import { LoadingState, ErrorState, EndState } from '../../../../shared/components';

@Component({
  selector: 'app-planets-list',
  imports: [PlanetCard, InfinityScrollDirective, LoadingState, ErrorState, EndState],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetsList implements OnInit {
  readonly planetsStore = inject(PlanetsStore);

  // Computed properties instead of functions in template
  readonly loadingState = computed<'initial' | 'more' | 'none'>(() => {
    if (!this.planetsStore.isLoading()) return 'none';
    if (!this.planetsStore.hasPlanets()) return 'initial';
    return 'more';
  });

  readonly showError = computed(() => 
    this.planetsStore.hasError() && !this.planetsStore.isLoading()
  );

  readonly showPlanets = computed(() => this.planetsStore.hasPlanets());

  readonly showInfinityScroll = computed(() => 
    this.planetsStore.hasPlanets() && !this.planetsStore.isLastPage()
  );

  readonly showEndState = computed(() => 
    this.planetsStore.isLastPage() && this.planetsStore.hasPlanets()
  );

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
   * Retry loading planets when an error occurs
   */
  retryLoading(): void {
    console.log('Retrying planet loading...');
    this.planetsStore.loadPlanets();
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
