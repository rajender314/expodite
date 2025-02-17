import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(public router: Router) { }

  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    
    if (((ActivatedRouteSnapshot.routeConfig.path == 'vendors') &&
     App.user_roles_permissions.filter(function(value){return (value.code=='vendors' && value.selected);}).length) &&
     App.env_configurations['VENDOR_MANAGEMENT'] == 'yes'
    ) {
      
      return true;
    }else{
     this.router.navigate(['access-denied']);
      return false;
    }

  }
}
