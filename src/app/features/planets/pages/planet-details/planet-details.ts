import { Component, input, inject, computed, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanetsStore } from '@features/planets/store/planets.store';
import { PlanetsApi } from '@features/planets/services/planets';
import { Planet, PlanetViewModel } from '@features/planets/models/planet.model';
import { PlanetDataFormatterService } from '@features/planets/services/planet-data-formatter';
import { PlanetSphere } from '@features/planets/components/planet-sphere/planet-sphere';
import { DataTable } from '@shared/components/data-table/data-table';
import { PlanetDataService } from '@shared/services/planet-data';

@Component({
  selector: 'app-planet-details',
  standalone: true,
  imports: [PlanetSphere, DataTable],
  templateUrl: './planet-details.html',
  styleUrl: './planet-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanetDetails implements OnInit {
  planetId = input.required<string>();
  
  private readonly planetsStore = inject(PlanetsStore);
  private readonly planetsApi = inject(PlanetsApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly planetDataFormatter = inject(PlanetDataFormatterService);
  private readonly planetDataService = inject(PlanetDataService);
  
  private readonly _specificPlanet = signal<Planet | null>(null);
  
  readonly planet = computed(() => {
    const planets = this.planetsStore.planets();
    const foundPlanet = planets.find(p => 
      ('uid' in p && p.uid === this.planetId())
    );
    
    return foundPlanet || this._specificPlanet();
  });

  readonly planetViewModel = computed<PlanetViewModel | null>(() => {
    const planet = this.planet();
    return planet ? this.planetDataFormatter.createPlanetViewModel(planet) : null;
  });

  readonly dataSections = computed(() => {
    const planet = this.planet();
    return planet ? this.planetDataService.formatForDetail(planet) : [];
  });

  readonly isLoading = computed(() => !this.planet());

  ngOnInit(): void {
    this.initializePlanetData();
  }

  private initializePlanetData(): void {
    // Load planets if the store is empty
    if (this.planetsStore.planets().length === 0) {
      this.planetsStore.loadPlanets();
    }
    
    this.loadSpecificPlanetIfNeeded();
  }

  private loadSpecificPlanetIfNeeded(): void {
    const planets = this.planetsStore.planets();
    const foundPlanet = planets.find(p => 
      ('uid' in p && p.uid === this.planetId())
    );
    
    if (!foundPlanet) {
      this.loadPlanetById();
    }
  }

  private loadPlanetById(): void {
    this.planetsApi.getPlanetById(this.planetId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (planetDetail) => {
        const planetWithUid = { ...planetDetail, uid: this.planetId() };
        this._specificPlanet.set(planetWithUid);
        this.planetsStore.addPlanet(planetWithUid);
      },
      error: (error) => {
        console.error('Error loading planet by ID:', error);
      }
    });
  }
}
