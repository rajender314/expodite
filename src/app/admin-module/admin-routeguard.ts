import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DefaultRouteGuard implements CanActivate {
  constructor( private router: Router) {}

  canActivate(): boolean {
    // const permissions = this.permissionService.getPermissions();

    // // Determine the default route based on permissions
    // const defaultRoute = permissions.find((route) =>
    //   ['company', 'roles', 'users', 'products'].includes(route)
    // );

    this.router.navigate(['admin/company']); // Redirect to the default route
    return false; // Prevent the default route from loading
  }
}
