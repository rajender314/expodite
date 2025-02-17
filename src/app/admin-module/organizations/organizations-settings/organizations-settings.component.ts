import { language } from "./../../../language/language.module";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmailValidator } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { Observable } from "rxjs/Observable";

import * as _ from "lodash";

import { Param } from "../../../custom-format/param";

import { OrganizationsComponent } from "../organizations.component";
import { OrganizationsService } from "../../../services/organizations.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { AlertDialogComponent } from "../../../dialogs/alert-dialog/alert-dialog.component";
import { UserAccessComponent } from "../../../dialogs/user-access/user-access.component";
import { ViewEncapsulation } from "@angular/core";
import { trigger, style, transition, animate } from "@angular/animations";
declare var App: any;

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: "app-organizations-settings",
  templateUrl: "./organizations-settings.component.html",
  styleUrls: ["./organizations-settings.component.scss"],
  providers: [OrganizationsService, SnakbarService],
  animations: [
    trigger("settingsAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("300ms ease-in", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationsSettingsComponent implements OnInit, OnChanges {
  @Input() Organization;

  // @Output() trigger = new EventEmitter<object>();
  public language = language;
  settingsForm: FormGroup;
  noSettings: boolean;
  activeState: boolean;
  private showFilter = false;
  selectedOrganization: any;
  settingsList: any[];
  currencyList: Observable<any[]>;
  // currencyList = ['INR', 'Doller'];
  public fetchingData = true;
  public emptyData = true;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService
  ) {}

  ngOnInit() {
    this.createForm();
    this.activeState = false;
  }
  selectState() {
    this.activeState = true;
    this.showFilter = true;
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(this.Organization)
    if (this.Organization != undefined) {
      this.noSettings = false;
      // this.settingsForm.markAsPristine(); // default form prisnstine
      this.fetchingData = true;

      if (this.Organization == 0) {
        this.newUser(true);
        return;
      } else if (this.Organization == -1) {
        this.noSettings = true;
        this.newUser(false);
      }
      if (this.Organization.id) {
        this.emptyData = false;
        this.noSettings = false;
        this.organizationsService
          .clientDetails({ id: this.Organization.id })
          .then((response) => {
            this.fetchingData = false;
            if (response.result.success) {
              if (response.result.data && response.result.data.length) {
                this.selectedOrganization = [];
                this.selectedOrganization = response.result.data;
                this.showFilter = true;
                this.setForm(this.selectedOrganization);
              } else {
                this.settingsForm.markAsPristine();
                this.newUser(true);
              }
            }
          })
          .catch((error) => console.log(error));
      } else {
        this.emptyData = true;
        this.noSettings = true;
        this.settingsForm.markAsPristine();
        this.activeState = false;
        this.newUser(true);
      }
    }
  }

  setForm(data?): void {
    this.settingsForm.setValue({
      first_name: data.firstname || "",
      email: data.email || "",
      org_id: this.Organization.id,
      status: true,
      id: data.id || "",
    });
  }

  newUser(flag: boolean): void {
    if (flag) this.settingsForm.reset();
    this.selectedOrganization = [];
    this.fetchingData = false;
  }
  setDirty(): void {
    this.settingsForm.markAsDirty();
  }

  cancel(form: any): void {
    if (this.selectedOrganization.length) {
      form.markAsPristine();
      this.activeState = false;
      this.setForm(this.selectedOrganization);
    } else {
      form.reset();
      this.activeState = false;
      this.setForm(this.selectedOrganization);
    }
  }

  submitDetails(form: any): void {
    let toast: object;
    if (!form.valid) return;
    let data = Object.assign({}, form.value);
    data["log_type"] = 2;
    data["status"] = true;
    data.org_id = this.Organization.id;

    data.id = this.selectedOrganization.id || 0;
    this.organizationsService
      .addSettings(data)
      .then((response) => {
        if (response.result.success) {
          this.selectedOrganization = response.result.data;
          form.markAsPristine();
          if (data.id)
            toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };

          if (App.user_details.id === this.selectedOrganization.id)
            Object.assign(App.user_details, this.selectedOrganization);
        } else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
        this.activeState = false;
      })
      .catch((error) => console.log(error));
  }
  checkModelType(msg: string, index: string): object {
    let data;
    switch (msg) {
      case "reset":
        data = {
          title: "Reset Password",
          url: "forgotPassword",
          msg:
            "Password Reset link will be sent to <b>'" +
            this.selectedOrganization[index].email +
            "'</b>. Are you sure you want to reset your password?",
          result: this.selectedOrganization[index],
        };
        break;
    }
    return data;
  }

  openDialog(msg: string, index: string): void {
    let modelData = this.checkModelType(msg, index);
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      panelClass: "alert-dialog",
      width: "600px",
      data: modelData,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  addNewUser(data: any): void {
    let usersData = {
      firstname: "",
      email: "",
      org_id: this.Organization.id,
      status: true,
      id: "",
    };
    if (data) Object.assign(usersData, data);
    let toast: object;
    let dialogRef = this.dialog.open(UserAccessComponent, {
      panelClass: "alert-dialog",
      width: "540px",
      data: usersData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // console.log(result)
        if (usersData.org_id) {
          let organisationUsersList = [];
          this.selectedOrganization.map(function (value) {
            if (value.id == usersData.id) {
              organisationUsersList.push(result.response);
            } else {
              organisationUsersList.push(value);
            }
          });
          if (usersData.id == "") {
            organisationUsersList.push(result.response);
          }
          this.selectedOrganization = organisationUsersList;
        } else {
          this.selectedOrganization.push(result.response);
        }
      }
    });
  }
  createForm(): void {
    this.settingsForm = this.fb.group({
      first_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      org_id: [],
      id: [null],
      status: [],
    });
  }
}
