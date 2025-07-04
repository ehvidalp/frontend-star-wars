import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY_PLANET_STORE, IPlanetsStore, PlanetListResponse } from '../models/planet.model';
import { Planets } from '../services/planets';
import { catchError, EMPTY, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanetsStore {
  private planetService = inject(Planets);
  private destroyRef = inject(DestroyRef);

  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE)

  readonly planets = computed(() => this.planetsStore().planets);
  readonly selectedPlanet = computed(() => this.planetsStore().selectedPlanet);
  readonly nextPageUrl = computed(() => this.planetsStore().nextPageUrl);
  readonly isLoading = computed(() => this.planetsStore().isLoading);


  loadPlanets(url?: string | null): void {
    const shouldLoad = (!!this.planetsStore().nextPageUrl && this.planets().length === 0) || this.planets().length === 0;

    if (!shouldLoad) return;

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
        const newPlanets = [...this.planets(), ...data.results];
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

}
