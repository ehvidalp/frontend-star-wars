import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { Planets } from '@features/planets/services/planets';
import { PlanetsStore } from '@features/planets/store/planets.store';
import { LoadingSize } from '@shared/models';
import { PlanetCard } from '@features/planets/components/planet-card/planet-card';
import { InfinityScrollDirective } from '@shared/directives/infinity-scroll';
import { LoadingState, ErrorState, EndState } from '@shared/components';
@Component({
  selector: 'app-planets-list',
  standalone: true,
  imports: [PlanetCard, InfinityScrollDirective, LoadingState, ErrorState, EndState],
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
    if (planet.uid) {
      return planet.uid;
    }
    return `${planet.name || 'unknown'}-${index}`;
  }
}
