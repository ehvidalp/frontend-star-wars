import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY_PLANET_STORE, IPlanetsStore, PlanetListResponse, Planet } from '@features/planets/models/planet.model';
import { PlanetsApi } from '@features/planets/services/planets';
import { catchError, EMPTY, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlanetsStore {
  private planetService = inject(PlanetsApi);
  private destroyRef = inject(DestroyRef);
  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE)
  readonly planets = computed(() => this.planetsStore().planets);
  readonly selectedPlanet = computed(() => this.planetsStore().selectedPlanet);
  readonly nextPageUrl = computed(() => this.planetsStore().nextPageUrl);
  readonly isLoading = computed(() => this.planetsStore().isLoading);
  readonly isLastPage = computed(() => !this.planetsStore().nextPageUrl);
  readonly error = computed(() => this.planetsStore().error);
  readonly hasError = computed(() => !!this.planetsStore().error);
  readonly hasPlanets = computed(() => this.planetsStore().planets.length > 0);
  loadPlanets(url?: string | null): void {
    const isInitialLoad = this.planets().length === 0;
    const hasNextPageToLoad = !!url && !!this.planetsStore().nextPageUrl;
    const shouldLoad = isInitialLoad || hasNextPageToLoad || (url && !this.planetsStore().isLoading);
    if (!shouldLoad) {
      return;
    }
    this.planetsStore.update(store => ({
      ...store,
      isLoading: true,
      error: null
    }));
    const apiUrl = url || this.planetsStore().nextPageUrl || null;
    this.planetService.getPlanets(apiUrl).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(data => {
        if (!data || !data.results.length) {
          this.planetsStore.update(store => ({
            ...store,
            isLoading: false,
            error: 'No planets found'
          }));
          return;
        }
        const transformedPlanets = data.results.map(planetExpanded => ({
          ...planetExpanded.properties,
          uid: planetExpanded.uid,
          _id: planetExpanded._id,
          description: planetExpanded.description
        }));
        
        const existingUids = new Set(this.planets().map(p => 'uid' in p ? p.uid : null));
        const newUniquePlanets = transformedPlanets.filter(planet => !existingUids.has(planet.uid));
        
        const newPlanets = [...this.planets(), ...newUniquePlanets];
        this.planetsStore.update(store => ({
          ...store,
          planets: newPlanets,
          nextPageUrl: data.next,
          isLoading: false,
          error: null
        }));
      }),
      catchError(error => {
        const errorMessage = error.message || 'Error in loading planets';
        this.planetsStore.update(store => ({
          ...store,
          isLoading: false,
          error: errorMessage
        }));
        return EMPTY;
      })
    ).subscribe();
  }

  addPlanet(planet: Planet): void {
    this.planetsStore.update(store => ({
      ...store,
      planets: [...store.planets, planet]
    }));
  }
}
