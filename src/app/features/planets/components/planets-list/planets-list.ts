import { Component, inject, OnInit } from '@angular/core';
import { Planets } from '../../services/planets';
import { PlanetsStore } from '../../store/planets.store';

@Component({
  selector: 'app-planets-list',
  imports: [],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css'
})
export class PlanetsList implements OnInit {
  readonly planetsStore = inject(PlanetsStore);

  ngOnInit(): void {
    this.planetsStore.loadPlanets();
  }

}
