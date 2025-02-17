// env-config.resolver.ts
import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable, from } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { AdminService } from "./services/admin.service";

@Injectable({
  providedIn: "root",
})
export class EnvConfigResolver implements Resolve<any> {
  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  resolve(): Observable<any> {
    return from(this.adminService.getEnvDetails({})).pipe(
      tap((response) => {
        if (response.result.success) {
          this.authService.setEnvConfig(response.result.data.env_config);
        }
      })
    );
  }
}
