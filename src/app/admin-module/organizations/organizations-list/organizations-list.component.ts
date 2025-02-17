import { ContactsViewService } from "./../../../services/contacts-view.service";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange,
  ViewEncapsulation,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as _ from "lodash";
import { Param } from "../../../custom-format/param";
import { OrganizationsService } from "../../../services/organizations.service";
import { DialogComponent } from "../../../dialog/dialog.component";
import { SnakbarService } from "../../../services/snakbar.service";
import { language } from "../../../language/language.module";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { ImportComponent } from "../../../dialogs/import/import.component";
import { Router } from "@angular/router";
import { Images } from "../../../images/images.module";
import { AdminService } from "../../../services/admin.service";
import { LeadsService } from "../../../leads/leads.service";
import { Subscription } from "rxjs";

declare var App: any;

@Component({
  selector: "app-organizations-list",
  templateUrl: "./organizations-list.component.html",
  styleUrls: ["./organizations-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [OrganizationsService, SnakbarService],
  animations: [
    trigger("clientsAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class OrganizationsListComponent implements OnInit, OnChanges {
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noOrganizations: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  organizationsList: Array<any> = [];
  selectedOrganizations: object;
  public language = language;
  public open = false;
  myProfile = true;
  //noRecords = [];

  private userProfileImg: string =
    App.public_url + "signatures/assets/images/avatar.png";

  @Input() update;
  @Output() trigger = new EventEmitter<object>();

  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
    org_type: 2,
    is_vendor: false,
    form_id: 0,
  };
  apiResponseSubscription: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    public contactsViewService: ContactsViewService,
    private router: Router,
    public adminService: AdminService,
    private leadService: LeadsService
  ) {}

  ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    let profile: boolean;
    this.getFormModules();
    App.user_roles_permissions.map(function (val) {
      if (val.code == "client_interface") {
        if (val.selected) {
          profile = true;
        } else {
          profile = false;
        }
      }
    });
    this.myProfile = profile;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.id) {
        this.organizationsList.map((organization) => {
          if (organization.id === this.update.id) {
            organization.company_name = this.update.result.company_name;
          }
        });
        this.selectedOrganizations = _.find(this.organizationsList, {
          id: this.update.id,
        });
      } else {
        this.totalCount = this.totalCount + 1;
        this.organizationsList.unshift(this.update.result);
        this.selectedOrganizations = this.update.result;
      }
    }
  }

  async getOrganizationsList(param: object, flag?: string, cb?) {
    if (flag == "pagination") this.paginationScroll = true;
    else this.fetchingData = true;
    await this.leadService
      .getModuleSavedList(param)
      .then((response) => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if (cb) this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.param.perPage
          );
          this.organizationsList = response.result.data.list;
          if (this.totalCount == 0) {
            this.noRecords();
          } else {
            if (this.contactsViewService.contactRowdata != undefined) {
              const index = _.findIndex(this.organizationsList, {
                id: this.contactsViewService.contactRowdata["org_id"],
              });
              this.getOrganization(this.organizationsList[index]);
              this.contactsViewService.contactRowdata = undefined;
            } else {
              this.getOrganization(this.organizationsList[0]);
            }
          }
        } else this.noRecords();
      })
      .catch((error) => console.log(error));
    return this.organizationsList;
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noOrganizations = true;
    this.organizationsList = [];
    this.selectedOrganizations = {};
    this.trigger.emit({ flag: "new" });
  }

  getOrganization(data?: any): void {
    this.noOrganizations = false;
    this.selectedOrganizations = data || {};
    this.trigger.emit(this.selectedOrganizations);
  }

  private timeout;
  searchOrganization(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrganizationsList(this.param, "search", () => {});
    }, 1000);
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getOrganizationsList(this.param, "pagination");
    }
  }

  addOrganization(): void {
    let toast: object;
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: "alert-dialog",
      width: "590px",
      autoFocus: false,
      disableClose: true,
      // height: '565px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.organizationsList.unshift(result.response);
        this.totalCount = this.totalCount + 1;
        console.log(result);

        setTimeout(() => {
          this.getOrganization(result.response);
        }, 10);
      }
    });
  }

  loadMore(param) {
    param.search = this.param.search;
    param.form_id = this.param.form_id;
    this.getOrganizationsList(param, "pagination");
  }
  importClients() {
    let toast: object;
    let dialogRef = this.dialog.open(ImportComponent, {
      width: "550px",
      data: "clients",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.getOrganizationsList(this.param);
      }
    });
  }
  public modulesList = [];
  getFormModules() {
    this.adminService
      .getModules({})
      .then((response) => {
        if (response.result.success) {
          this.modulesList = response.result.data.modulesDt;
          const indx = _.findIndex(this.modulesList, { slug: "add_client" });
          console.log(indx);
          if (indx > -1) {
            this.param.form_id = this.modulesList[indx].id;
            this.getOrganizationsList(this.param);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  prefillAttributes(id: string) {
    this.param.form_id = id;
    this.leadService
      .getModuleSavedList(this.param)
      .then((response) => {
        if (response.result.success) {
          this.organizationsList = response.result.data.list;
        }
      })
      .catch((error) => console.log(error));
  }
}
