import { Component } from '@angular/core';
import { PlanetsList } from "../../../planets/components/planets-list/planets-list";
import { Welcome } from '../../components/welcome/welcome';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PlanetsList, Welcome],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
