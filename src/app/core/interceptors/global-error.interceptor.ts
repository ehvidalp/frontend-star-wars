import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (shouldHandleGlobally(error)) handleGlobalError(error);

      return throwError(() => error);
    })
  );
};

function shouldHandleGlobally(error: HttpErrorResponse): boolean {
  return error.status >= 500 || error.status === 0;
}

function handleGlobalError(error: HttpErrorResponse): void {
  console.error('Error HTTP global:', error);
  
  const errorDetails = {
    status: error.status,
    statusText: error.statusText,
    url: error.url,
    message: error.message,
    timestamp: new Date().toISOString()
  };
  
  console.error('Details of error:', errorDetails);

}
