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
  role = 'ROLE_USER';

  constructor(private auth: AuthService, private router: Router) { }

  /*login(): void {
    this.auth.login(this.username, this.password, this.role).subscribe({
      next: success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        if (err.status === 403) {
          alert('Role does not match credentials!');
        } else {
          alert('Login failed. Please check your credentials.');
        }
      }
    });
  }*/

  login(): void {
    this.auth.login(this.username, this.password, this.role).subscribe({
      next: success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        if (err.status === 403) {
          alert('Role does not match credentials!');
        } else if (err.status === 401) {
          alert('Login failed. Please check your credentials.');
        }
      }
    });
  }


  register() {
    this.router.navigate(['/register']);
  }

}
