import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust path if needed

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get token (assuming you have a getToken() method, or read from localStorage directly)
  const token = localStorage.getItem('admin_token'); // Adjust key if yours is different

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If the backend says the token is expired or invalid
      if (error.status === 401) {
        // Clear the bad token
        localStorage.removeItem('admin_token');
        // If your authService uses a signal, reset it (e.g., authService.isAuthenticated.set(false))
        if (authService.logout) authService.logout();

        // Force them back to the login screen
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    }),
  );
};
