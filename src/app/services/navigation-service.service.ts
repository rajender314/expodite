import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationServiceService {

  public history: string[] = [];

  constructor(private router: Router) {
    this.loadHistory();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
        this.saveHistory();
      } 
    });
  }

  getHistory(): string[] {
    return [...this.history]; // Return a copy of the history
  }

  getPreviousUrl(): string | null {
    return this.history.length > 1 ? this.history[this.history.length - 2] : null;
  }

  private loadHistory() {
    const savedHistory = sessionStorage.getItem('navigationHistory');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }
  }

  private saveHistory() {
    sessionStorage.setItem('navigationHistory', JSON.stringify(this.history));
  }
}
