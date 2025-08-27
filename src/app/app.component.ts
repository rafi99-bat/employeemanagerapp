import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'employeemanagerapp';
  showNavbar = true;
  searchTerm = '';
  showSearch: boolean = false;
  showSidebar: boolean = false;

  constructor(public auth: AuthService, private router: Router, private searchService: SearchService) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        const navEnd = event as NavigationEnd;
        this.showNavbar = !navEnd.urlAfterRedirects.includes('/login');
      });
  }

  onSearchChange(): void {
    this.searchService.setSearchTerm(this.searchTerm);
  }
}
