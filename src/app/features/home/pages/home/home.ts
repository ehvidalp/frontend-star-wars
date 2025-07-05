import { Component } from '@angular/core';
import { PlanetsList } from "../../../planets/components/planets-list/planets-list";

@Component({
  selector: 'app-home',
  imports: [PlanetsList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
