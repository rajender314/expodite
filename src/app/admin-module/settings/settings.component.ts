import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { language } from "../../language/language.module";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  detailsForm: FormGroup;
  public language = language;
  packageNumber: any;
  Contacts: any;
  submited: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private snackbar: SnakbarService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
    this.generateDetailsForm();
    this.getSettings();
  }

  getSettings(): void {
    this.adminService
      .getSettings()
      .then((response) => {
        if (response.result.success) {
          this.Contacts = response.result.data;
          this.setForm(this.Contacts);
          //	console.log(this.Contacts)
        }
      })
      .catch((error) => console.log(error));
  }
  setForm(data: any): void {
    this.detailsForm.patchValue({
      mailFlag: data.mailFlag == true ? "true" : "false",
      force_package: data.force_package,
      // packageNumber:data.packageNumber		<!--hiding for automech >
    });
  }
  generateDetailsForm(): void {
    this.detailsForm = this.formBuilder.group({
      // packageNumber:[null, Validators.required], <!--hiding for automech >

      mailFlag: [],
      force_package: false,
    });

    if(this.adminService.rolePermissions.edit_settings == 1) {
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }

  updateOrganization(form?: any): void {
    if (form.valid) {
      let toast: object;
      this.submited = true;
      let param = Object.assign({}, form.value);
      this.adminService
        .saveSettings(param)
        .then((response) => {
          if (response.result.success) {
            form.markAsPristine();
            toast = {
              msg: "Settings Updated Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          }
        })
        .catch((error) => console.log(error));
    }
  }
  cancel(form: any): void {
    this.setForm(this.Contacts);
    form.markAsPristine();
  }
}
