import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { PlanetsStore } from '@features/planets/store/planets.store';
import { LoadingSize } from '@shared/models/ui-state.model';
import { PlanetCardDirective } from '@features/planets/components/planet-card/planet-card';
import { PlanetCardContent } from '@features/planets/components/planet-card/planet-card-content';
import { InfinityScrollDirective } from '@shared/directives/infinity-scroll';
import { LoadingState } from '@shared/components/loading-state/loading-state';
import { ErrorState } from '@shared/components/error-state/error-state';
import { EndState } from '@shared/components/end-state/end-state';

@Component({
  selector: 'app-planets-list',
  standalone: true,
  imports: [PlanetCardDirective, PlanetCardContent, InfinityScrollDirective, LoadingState, ErrorState, EndState],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetsList implements OnInit {
  readonly planetsStore = inject(PlanetsStore);
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
      this.planetsStore.loadPlanets(nextUrl);
    }
  }
  retryLoading(): void {
    this.planetsStore.loadPlanets();
  }
  trackByPlanet(index: number, planet: any): string {
    // Usar uid si está disponible (formato expandido)
    if ('uid' in planet && planet.uid) {
      return planet.uid;
    }
    // Fallback con el nombre y index
    return `${planet.name || 'unknown'}-${index}`;
  }
}
