import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register(): void {
    this.auth.register(this.username, this.password).subscribe({
      next: res => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert('Registration failed: ' + err.error);
      }
    });
  }
}
