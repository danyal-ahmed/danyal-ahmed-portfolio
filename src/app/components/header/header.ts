import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  // Import routing directives to manage routes in the template
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  isDropdownOpen = signal(false);

  toggleDropdown(): void {
    this.isDropdownOpen.update((val) => !val);
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen.set(false);
  }
}
