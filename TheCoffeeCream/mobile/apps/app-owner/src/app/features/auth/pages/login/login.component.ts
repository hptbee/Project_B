import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn() && this.auth.isSuperAdmin()) {
      this.router.navigate(['/shops']);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.error = '';

    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.router.navigate(['/shops']).then((success) => {
          if (!success) {
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.error = err.error || 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
