import { throwError as observableThrowError, Observable } from "rxjs";

import { catchError, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { TokenExpiredComponent } from "../dialogs/token-expired/token-expired.component";
import { LeadsService } from "../leads/leads.service";
import * as _ from "lodash";
import { ActivatedRoute, Router } from "@angular/router";
import { OrganizationsService } from "./organizations.service";
import { SnakbarService } from "./snakbar.service";

declare var App: any;
@Injectable({
  providedIn: "root",
})
export class HttpInterceptorService implements HttpInterceptor {
  public dialogShow = true;
  saveAttributeProps: any;
  public customFormFields: any;
  public orderId = "";
  public newCustomFormGroup: any;
  constructor(
    public dialog: MatDialog,
    private service: LeadsService,
    private organizationsService: OrganizationsService,
    private router: Router,
  ) {
    this.service.FormSharingData.subscribe((res: any) => {
      this.newCustomFormGroup = res;
    });
  }
  returnUrl = App.base_url + "do-logout";
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = App.token;

    if (request.url.split("/")[3] === "getListOrders") {
      this.orderId = request.body.id;
    }
    if (request.url.split("/")[3] === "addOrgContacts" || request.url.split("/")[3] === "addOrgAddress") {
      this.orderId = request.body.organization_id;
    }

    const customReq = request.clone({ setHeaders: { "X-JWT-Token": token } });
    return next.handle(customReq).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          if (ev.body.result.status_code === 1000) {
            if (this.dialogShow) {
              this.dialogShow = false;
              let dialogRef = this.dialog.open(TokenExpiredComponent, {
                panelClass: "alert-dialog",
                disableClose: true,
                width: "600px",
              });
              dialogRef.afterClosed().subscribe((result) => {
                if (result.success) {
                  location.href = this.returnUrl;
                }
              });
            }

            setTimeout(() => {
              location.href = this.returnUrl;
            }, 2000);
          } else if (ev.body.result.status_code === 401) {
            this.router.navigate(["/access-denied"]);
          }
        }
      }),
      catchError((response) => {
        if (response instanceof HttpErrorResponse) {
          // console.log('Processing http error', response);
        }

        return observableThrowError(response);
      })
    );
  }

  public storesAttributesData = [];
  public module;
  async getOrgStoreAttribute(mod: string) {
    await this.service
      .getOrgStoreAttributeList({
        id: "",
        module: mod,
      })
      .then((response) => {
        if (response.result.success) {
          this.storesAttributesData =
            response.result.data.attributes.base_attributes;
          this.module = response.result.data.attributes.form_id;
        }
      })
      .catch((error) => console.log(error));
  }

  public totalClients = [];
  async getOrganizations() {
    await this.organizationsService
      .getOrganizationsList({ flag: 1, sort: "ASC" })
      .then((response) => {
        if (response.result.success) {
          this.totalClients = response.result.data.organization;
        }
      });
  }
}
