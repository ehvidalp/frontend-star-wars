import { Component, inject } from '@angular/core';
import { Planets } from '../../services/planets';

@Component({
  selector: 'app-planets-list',
  imports: [],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.css'
})
export class PlanetsList {
  private readonly planetsService = inject(Planets);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.callPlanets();
  }

  callPlanets() {
    this.planetsService.getPlanets().subscribe({
      next: (data) => {
        console.log('Planets data:', data);
      },
      error: (error) => {
        console.error('Error fetching planets:', error);
      }
    });
  }
}
