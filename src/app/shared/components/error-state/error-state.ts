import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorState {
  title = input<string>('Error en la Comunicación Galáctica');
  message = input<string>('Ha ocurrido un error inesperado');
  showRetryButton = input<boolean>(true);
  retryText = input<string>('Reintentar');
  retryLabel = input<string>('Reintentar operación');
  retry = output<void>();
  onRetry(): void {
    this.retry.emit();
  }
}
