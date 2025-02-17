import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DefaultRouteResolver implements Resolve<string> {
  constructor(private router: Router) {}

  resolve(): string {
    // const permissions = this.permissionService.getPermissions();

    // // Determine the default route based on permissions
    // const defaultRoute = permissions.find((route) =>
    //   ['company', 'roles', 'users', 'products'].includes(route)
    // );

    return  'company'; // Fallback to 'company' if no match
  }
}
