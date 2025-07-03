import { Component } from '@angular/core';
import { Welcome } from '../../components/welcome/welcome';
import { PlanetsList } from "../../../planets/components/planets-list/planets-list";

@Component({
  selector: 'app-home',
  imports: [Welcome, PlanetsList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
