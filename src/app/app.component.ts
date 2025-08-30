import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNavbar = false;
  isMobile = false;
  showSearch = false;
  showSidebar = false;
  searchTerm = '';

  constructor(private router: Router, public auth: AuthService, public searchService: SearchService) { }

  ngOnInit(): void {
    // Initial screen size + route check
    this.checkScreenSize();
    this.updateNavbarVisibility(this.router.url);

    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.urlAfterRedirects);
      }
    });
  }

  // Detect resize
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
    this.updateNavbarVisibility(this.router.url);
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Bootstrap breakpoint
  }

  private updateNavbarVisibility(url: string) {
    if (url.includes('/login')) {
      // Show navbar only on mobile for login page
      this.showNavbar = this.isMobile;
    } else if (url.includes('/register')) {
      // Always show navbar on register page
      this.showNavbar = true;
    } else {
      // Always show navbar for other pages
      this.showNavbar = true;
    }
  }

  onSearchChange() {
    this.searchService.setSearchTerm(this.searchTerm);
  }
}