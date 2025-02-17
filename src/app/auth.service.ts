// auth.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private envConfig: any[] = [];

  constructor() {}

  setEnvConfig(config: any[]): void {
    this.envConfig = config;
  }

  getEnvConfig(): any[] {
    return this.envConfig;
  }

  isAuthenticated(envConfig: any, route: string): boolean {
    return envConfig.some(
      (item) => item.routerlink === route && item.display === "yes"
    );
  }
}
