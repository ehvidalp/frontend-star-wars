import { Component, inject, OnInit } from '@angular/core';
import { Planets } from '../../services/planets';
import { PlanetsStore } from '../../store/planets.store';
import { InfinityScrollDirective } from '../../../../shared/directives/infinity-scroll';
import { CommonModule } from '@angular/common';
import { PlanetCard } from '../planet-card/planet-card';

@Component({
  selector: 'app-planets-list',
  imports: [InfinityScrollDirective, CommonModule, PlanetCard],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css'
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
   * Track by function for ngFor to improve performance
   * Uses planet name as unique identifier
   */
  trackByPlanet(index: number, planet: any): string {
    return planet.name || index.toString();
  }
}
