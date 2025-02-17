import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  constructor(
    private router: Router,
    private historyService: NavigationServiceService
  ) { }

  ngOnInit(): void {
  }

  goToDashboard() {
    const previousUrl = this.historyService.getPreviousUrl();
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl); 
    } else {
      this.router.navigateByUrl('/overview'); 
    }
    // this.router.navigate(['/overview']);
    // this.location.back();

  }

}
