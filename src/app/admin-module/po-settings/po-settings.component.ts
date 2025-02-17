import { Component, OnInit, SimpleChanges } from "@angular/core";
import { language } from "../../language/language.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UsersService } from "../../services/users.service";
import { OrganizationsService } from "../../services/organizations.service";
import { HttpClient } from "@angular/common/http";
import { SnakbarService } from "../../services/snakbar.service";
import { LeadsService } from "../../leads/leads.service";
import { AdminService } from "../../services/admin.service";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "app-po-settings",
  templateUrl: "./po-settings.component.html",
  styleUrls: ["./po-settings.component.scss"],
})
export class PoSettingsComponent implements OnInit {
  public language = language;
  seriesForm: FormGroup;
  totalSpinner: false;
  qutationSettings: any;
  activestate: boolean;
  loading: boolean = false;
  selectedTabIndex;
  sample_series: any;
  yearOptions = [
    {
      value: "fullYearRange",
      label: "Full Year Range",
      type: "full_year_range",
    },
    {
      value: "shortYearRange",
      label: "Short Year Range",
      type: "short_year_range",
    },
    {
      value: "singleFullYear",
      label: "Single Full Year",
      type: "single_full_year",
    },
    {
      value: "singleShortYear",
      label: "Single Short Year",
      type: "single_short_year",
    },
  ];
  showSample: boolean = false;

  constructor(
    public dialog: MatDialog,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
    this.generateDetailsForm();
    this.getQutationSettings();
    // setTimeout(() => {
    //   if (
    //     this.contactsViewService.contactRowdata &&
    //     this.contactsViewService.contactRowdata["org_id"] != undefined
    //   ) {
    //     this.selectedTabIndex = 1;
    //   } else {
    //     this.selectedTabIndex = 0;
    //   }
    // }, 1000);
    setTimeout(() => {
      this.loading = true;
    }, 1000);
    this.seriesForm.valueChanges.subscribe(() => {
      this.showSample = false;
    });

    if (this.adminService.rolePermissions.edit_po_settings == 1) {
      this.seriesForm.enable();
    } else if (this.adminService.rolePermissions.edit_po_settings == 2) {
      this.seriesForm.disable();
    }
  }
  generateDetailsForm(): void {
    this.seriesForm = this.formBuilder.group({
      generation_type: [null, Validators.required],
      enable_prefix: [false],
      prefix: [""],
      prefix_display_order: [""],

      numbering_value: [""],
      numbering_display_order: [""],

      enable_suffix: [false],
      suffix: [""],
      suffix_display_order: [""],

      client_code: [false],
      client_code_display_order: [""],

      enable_year_format: [false],
      year_format: [""],
      year_format_display_order: [""],

      enable_separator: [false],
      separator: ["/"],
      separatorDisplayOrder: [""],
    });
    this.handleGenerationTypeChanges();
  }
  onOptionChange(value: string) {
    console.log("Selected option:", value);
    // Handle changes based on the selected option
  }
  public tabIndex: number = 0;
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    if (tabChangeEvent.index != 0) {
      this.activestate = false;
    }
    if (tabChangeEvent.index == 1) {
      this.getQutationSettings();
      // this.getOrgStoreAttribute("add_contact");
    }
    if (tabChangeEvent.index == 0) {
      // this.getOrgStoreAttribute("add_address");
    }
    if (tabChangeEvent.index == 2) {
      // this.getOrgStoreAttribute("account_manager");
    }
  }
  handleGenerationTypeChanges(): void {
    this.seriesForm.get("generation_type")?.valueChanges.subscribe((value) => {
      if (value === "auto") {
        this.seriesForm
          .get("numbering_value")
          .setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
        this.seriesForm
          .get("numbering_display_order")
          .setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
        this.applyAllDependentValidations();
      } else {
        this.seriesForm.get("numbering_display_order").clearValidators;
        this.seriesForm.get("numbering_value").clearValidators;

        this.clearAllDependentValidations();
      }
    });
  }

  applyAllDependentValidations(): void {
    const enableFields = [
      {
        enable: "enable_prefix",
        field: "prefix",
        displayOrder: "prefix_display_order",
      },
      // {
      //   enable: "enablenumbering_value",
      //   field: "numbering_value",
      //   displayOrder: "numbering_display_order",
      // },
      {
        enable: "enable_suffix",
        field: "suffix",
        displayOrder: "suffix_display_order",
      },
      {
        enable: "client_code",
        // field: "clientCode",
        displayOrder: "client_code_display_order",
      },
      {
        enable: "enable_year_format",
        field: "year_format",
        displayOrder: "year_format_display_order",
      },
      {
        enable: "enable_separator",
        field: "separator",
      },
    ];

    enableFields.forEach(({ enable, field, displayOrder }) => {
      this.seriesForm.get(enable)?.valueChanges.subscribe((isEnabled) => {
        const fieldControl = this.seriesForm.get(field);
        const displayOrderControl = this.seriesForm.get(displayOrder);

        if (isEnabled) {
          // Apply validators when the enable field is checked
          fieldControl?.setValidators([Validators.required]);
          displayOrderControl?.setValidators([
            Validators.required,
            Validators.pattern(/^\d+$/), // Ensure numeric input for display order
          ]);
        } else {
          // Clear validators and reset fields when unchecked
          fieldControl?.clearValidators();
          displayOrderControl?.clearValidators();
          // fieldControl?.reset();
          // displayOrderControl?.reset();
        }

        // Update validation state
        fieldControl?.updateValueAndValidity();
        displayOrderControl?.updateValueAndValidity();
      });
    });
  }

  clearAllDependentValidations(): void {
    const dependentFields = [
      "prefix",
      "prefix_display_order",
      // "numbering_value",
      // "numbering_display_order",
      "suffix",
      "suffix_display_order",
      "client_code_display_order",
      "year_format",
      "year_format_display_order",
      "separator",
    ];

    dependentFields.forEach((field) => {
      const control = this.seriesForm.get(field);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });
  }
  setForm(data?: any): void {
    this.seriesForm.patchValue({
      generation_type: data && data.generation_type ? data.generation_type : "",
      enable_prefix: data && data.enable_prefix ? data.enable_prefix : false,
      prefix: data && data.prefix ? data.prefix : "",
      prefix_display_order:
        data && data.prefix_display_order ? data.prefix_display_order : "",
      enablenumbering_value:
        data && data.enablenumbering_value ? data.enablenumbering_value : false,
      numbering_value: data && data.numbering_value ? data.numbering_value : "",
      numbering_display_order:
        data && data.numbering_display_order
          ? data.numbering_display_order
          : "",
      enable_suffix: data && data.enable_suffix ? data.enable_suffix : false,
      suffix: data && data.suffix ? data.suffix : "",
      suffix_display_order:
        data && data.suffix_display_order ? data.suffix_display_order : "",
      client_code: data && data.client_code ? data.client_code : false,
      client_code_display_order:
        data && data.client_code_display_order
          ? data.client_code_display_order
          : "",
      enable_year_format:
        data && data.enable_year_format ? data.enable_year_format : false,
      year_format: data && data.year_format ? data.year_format : "",
      year_format_display_order:
        data && data.year_format_display_order
          ? data.year_format_display_order
          : "",
      enable_separator:
        data && data.enable_separator ? data.enable_separator : false,
      separator: data && data.separator ? data.separator : "/",
      separatorDisplayOrder:
        data && data.separatorDisplayOrder ? data.separatorDisplayOrder : "",
    });
  }
  cancel(form) {
    this.setForm(this.qutationSettings);
    form.markAsPristine();
    this.showSample = false;
    // form.reset();
  }
  addSeries(form, type) {
    let toast: any;
    let param = Object.assign({}, form.value);
    param.type = "po";
    param.show_sample_format = type === "sample" ? true : false;
    // if (this.qutationSettings.id) {
    //   param.id = this.qutationSettings.id;
    // }
    this.adminService.saveNumberSeriesSettingsApi(param).then((response) => {
      if (response.result.success) {
        this.sample_series = response?.result?.data?.sample_series;
        if (type === "save") {
          this.qutationSettings = response.result.data;
          this.getQutationSettings();
          toast = {
            msg: response.result.message,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          form.markAsPristine();
        } else {
          this.showSample = true;
        }
      } else {
        toast = {
          msg: response.result.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        form.markAsPristine();
      }
      // this.cancel(form);
      // this.toastr.success("Series settings saved successfully");
    });
  }
  getQutationSettings() {
    this.adminService
      .getNumberSeriesSettings({ type: "po" })
      .then((response) => {
        if (response.result.success) {
          console.log(response);
          this.qutationSettings = response.result.data;

          this.setForm(this.qutationSettings);
        }
        // this.cancel(form);
        // this.toastr.success("Series settings saved successfully");
      });
  }
  onCheckboxChange(controlName: string): void {
    if (
      controlName === "prefix" &&
      !this.seriesForm.get("enable_prefix")?.value
    ) {
      // Reset related prefix fields if the checkbox is unchecked
      this.seriesForm.patchValue({
        prefix: "",
        prefix_display_order: null,
      });
    }

    if (
      controlName === "suffix" &&
      !this.seriesForm.get("enable_suffix")?.value
    ) {
      // Reset related suffix fields if the checkbox is unchecked
      this.seriesForm.patchValue({
        suffix: "",
        suffix_display_order: null,
      });
    }

    if (
      controlName === "year" &&
      !this.seriesForm.get("enable_year_format")?.value
    ) {
      // Reset year format fields if the checkbox is unchecked
      this.seriesForm.patchValue({
        year_format: null,
        year_format_display_order: null,
      });
    }
    if (
      controlName === "separator" &&
      !this.seriesForm.get("enable_separator")?.value
    ) {
      // Reset separator fields if the checkbox is unchecked
      this.seriesForm.patchValue({
        separator: null,
      });
    }
    if (
      controlName === "client_code" &&
      !this.seriesForm.get("client_code")?.value
    ) {
      // Reset separator fields if the checkbox is unchecked
      this.seriesForm.patchValue({
        client_code_display_order: null,
      });
    }
  }
}
