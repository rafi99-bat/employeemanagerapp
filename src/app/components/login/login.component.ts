import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  credFailed = false;
  loginError = '';

  constructor(private auth: AuthService, private router: Router) { }

  login(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        if (err.status === 401) {
          this.loginError = 'Login failed. Please check your credentials.';
          this.credFailed = true;
        }
      }
    });
  }

  register() {
    this.router.navigate(['/register']);
  }

}
