import { Component, input, inject, computed, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanetsStore } from '@features/planets/store/planets.store';
import { PlanetsApi } from '@features/planets/services/planets';
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
  private planetsApi = inject(PlanetsApi);
  private destroyRef = inject(DestroyRef);
  
  // Signal para manejar el estado del planeta específico
  private _specificPlanet = signal<Planet | null>(null);
  
  // Computed que combina el planeta del store y el cargado específicamente
  planet = computed(() => {
    const planets = this.planetsStore.planets();
    const foundPlanet = planets.find(p => 
      ('uid' in p && p.uid === this.planetId())
    );
    
    // Si no encontramos el planeta en el store, devolver el cargado específicamente
    return foundPlanet || this._specificPlanet();
  });

  planetUid = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? planet.uid : 'N/A';
  });

  cardTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-card-${planet.uid}` : '';
  });

  sphereTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-sphere-${planet.uid}` : '';
  });

  titleTransitionName = computed(() => {
    const planet = this.planet();
    return planet && 'uid' in planet ? `planet-title-${planet.uid}` : '';
  });

  ngOnInit(): void {
    // Cargar planetas si el store está vacío
    if (this.planetsStore.planets().length === 0) {
      this.planetsStore.loadPlanets();
    }
    
    // Verificar si necesitamos cargar el planeta específico
    this.checkAndLoadSpecificPlanet();
  }

  private checkAndLoadSpecificPlanet(): void {
    const planets = this.planetsStore.planets();
    const foundPlanet = planets.find(p => 
      ('uid' in p && p.uid === this.planetId())
    );
    
    // Si no encontramos el planeta en el store, cargarlo por ID
    if (!foundPlanet) {
      this.loadPlanetById();
    }
  }

  private loadPlanetById(): void {
    this.planetsApi.getPlanetById(this.planetId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (planetDetail) => {
        // Crear el planeta con uid y guardarlo en el signal
        const planetWithUid = { ...planetDetail, uid: this.planetId() };
        this._specificPlanet.set(planetWithUid);
        
        // Opcionalmente, también agregarlo al store para futuras referencias
        this.planetsStore.addPlanet(planetWithUid);
      },
      error: (error) => {
        console.error('Error loading planet by ID:', error);
      }
    });
  }
}
