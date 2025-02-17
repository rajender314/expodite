import { Injectable } from '@angular/core';
import { RouterModule, CanActivate, Router } from '@angular/router';
declare var App: any;
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class InvoicesService implements CanActivate{
  public routeAllowed = false;
  constructor( public router: Router) {}
 canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
  // console.log(ActivatedRouteSnapshot)
  

  let i = _.findIndex(<any>App.env_configurations.env_config, {
    name: 'Invoices'
  });
  // console.log(i)
  if( i > -1  && App.env_configurations.env_config[i].display == 'yes') {
    this.routeAllowed = true;
  } else {
    this.routeAllowed = false;

  }
     if (((ActivatedRouteSnapshot.routeConfig.path == 'invoices') &&
      App.user_roles_permissions.filter(function(value){return (value.code=='invoices' && value.selected);}).length &&
      this.routeAllowed
      )
     ) {
      //  console.log(ActivatedRouteSnapshot)
       return true;
     }else{
      this.router.navigate(['access-denied']);
       return false;
       
     }
 
   }

}
