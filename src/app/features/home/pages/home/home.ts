import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PlanetsList } from "@features/planets/components/planets-list/planets-list";
import { Welcome } from '@features/home/components/welcome/welcome';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PlanetsList, Welcome],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
}
