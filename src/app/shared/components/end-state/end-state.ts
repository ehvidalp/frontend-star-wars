import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-end-state',
  templateUrl: './end-state.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EndState {
  message = input<string>('Has llegado al final de la galaxia.');
  ariaLabel = input<string>('Fin de la lista');
}
