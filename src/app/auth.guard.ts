import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, of, interval } from "rxjs";
import { switchMap, takeWhile, catchError, map, take } from "rxjs/operators";
import { AdminService } from "./services/admin.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,

    private adminService: AdminService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const routePath = state.url.split("/")[1];

    return this.adminService.getEnvConfigs({}).pipe(
      map((res: any) => {
        // console.log("API response:", res); // Debug log for API response
        if (
          res &&
          res.result &&
          res.result.data &&
          res.result.data.env_config
        ) {
          // Use the fetched data to decide if the route can be activated
          const canActivate = this.authService.isAuthenticated(
            res.result.data.env_config,
            routePath
          );
          if (canActivate) {
            return canActivate;
          }
        }
        // If data couldn't be fetched, deny access
        this.router.navigate(["/access-denied"]);
        return false;
      })
    );
    // let envConfigs;
    // while (this.authService.getEnvConfig().length == 0) {
    //   envConfigs = this.authService.getEnvConfig;
    // }
    // if (this.authService.isAuthenticated(routePath)) {
    //   return of(true);
    // } else {
    //   this.router.navigate(["/access-denied"]);
    //   return of(false);
    // }
    // Poll the getEnvConfig until it has length > 0
    // return interval(50).pipe(
    //   take(10),
    //   // Poll every second
    //   switchMap(() => of(this.authService.getEnvConfig().length > 0)),
    //   takeWhile((envConfigLength) => !envConfigLength, true), // Continue until length > 0
    //   switchMap(() => {
    //     // Now check authentication
    //     if (this.authService.isAuthenticated(routePath)) {
    //       return of(true);
    //     } else {
    //       this.router.navigate(["/access-denied"]);
    //       return of(false);
    //     }
    //   }),
    //   catchError(() => {
    //     if (this.authService.isAuthenticated(routePath)) {
    //       return of(true);
    //     } else {
    //       this.router.navigate(["/access-denied"]);
    //       return of(false);
    //     }
    //   })
    // );
  }
}
