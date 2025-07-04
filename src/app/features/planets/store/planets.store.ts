import { computed, inject, Injectable, signal } from '@angular/core';
import { EMPTY_PLANET_STORE, IPlanetsStore } from '../models/planet.model';
import { Planets } from '../services/planets';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanetsStore {

  private planetsStore = signal<IPlanetsStore>(EMPTY_PLANET_STORE)

  private planetService = inject(Planets);

  readonly planets = computed(() => this.planetsStore().planets);
  readonly selectedPlanet = computed(() => this.planetsStore().selectedPlanet);


  loadPlanets(planetsUrl?: string): void {
    const isLoadPlanets = !!planetsUrl || this.planets().length === 0

    console.log({isLoadPlanets})
    if (!isLoadPlanets) return;

    const currentApiUrl = (planetsUrl || this.planetsStore().nextPageUrl) as string;
    
    this.planetService.getPlanets(currentApiUrl)
    .pipe(take(1))
    .subscribe({
      next: (data) => {        
      
        console.log('Planets data:', data);
        if (!data || !data.results.length) {
          console.warn('No planets data received');
          return;
        }
        
        const newPlanets = [...this.planets(), ...data.results];
        this.planetsStore.update(store => ({
          ...store,
          planets: newPlanets,
          nextPageUrl: data.next
        }));
      },
      error: (error) => {
        console.error('Error fetching planets:', error);
      }
    });
  }
}
