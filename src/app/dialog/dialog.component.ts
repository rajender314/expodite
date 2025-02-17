import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
} from "@angular/core";
import { MatInputModule, MatInput } from "@angular/material/input";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FileUploader } from "ng2-file-upload";
import { language } from "../language/language.module";
import { SnakbarService } from "./../services/snakbar.service";
import { AdminService } from "./../services/admin.service";

//services import//
import { OrganizationsService } from "../services/organizations.service";
import { CustomValidation } from "../custom-format/custom-validation";
import { UtilsService } from "../services/utils.service";
import { LeadsService } from "../leads/leads.service";
declare var App: any;
@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: [
    "./dialog.component.scss",
    "../admin-module/organizations/organizations-contacts/organizations-contacts.component.scss",
  ],
})
export class DialogComponent implements OnInit {
  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();
  @ViewChild("firstname", { static: true }) firstname: any;
  detailsForm: FormGroup;
  public language = language;
  currencyX: any[];
  countries: any;
  states: any[];
  status = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];

  uploads = [];
  pointerEvent: boolean;
  public disabledSave = false;
  uploadError = false;
  sizeError: boolean;
  private imageUploadUrl = App.base_url + "uploadOrgImage";
  submitCountry = false;
  submitState = false;
  countriesStates: any;
  public selectedtype;
  public hasDropZoneOver: boolean = false;
  private websitePattern =
    /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  private ClientNamePfiSeries = /^[a-zA-Z0-9]+$/;
  private NUMBER_PATTERN = /^[0-9]+$/;
  private specialCharacter = /^[a-zA-Z0-9]+$/;
  public activestate;
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ["image/png", "image/jpeg", "image/jpg"],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public showSpinner = false;
  public is_automech = App.env_configurations.is_automech;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  constructor(
    private organizationsService: OrganizationsService,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadService: LeadsService
  ) {}
  ngOnInit() {
    // this.createForm();
    // this.getOrganization();
    // this.getOrganizationDetails();
    // this.selectedtype = this.status[0].param;
    // this.leadService.apiResponse$.subscribe(async (response: any) => {
    //   if (response) {
    //     setTimeout(() => {
    //       this.trigger.closed = true;
    //       this.dialogRef.close({ success: true, response: response.new_data });
    //     }, 1000);
    //     this.uploadError = false;
    //     this.sizeError = false;
    //     this.showSpinner = false;
    //     this.leadService.clearApiResponse();
    //   }
    // });
  }

  getOrganization(): void {
    let param = {
      page: "",
      perPage: "",
      sort: "ASC",
      search: "",
    };
    this.organizationsService
      .getOrganizationsList(param)
      .then((response) => {
        if (response.result.success) {
          // this.currencyX = response.result.data.currencyDt;
          // console.log(response.result.data)
        }
      })
      .catch((error) => console.log(error));
  }
  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then((response) => {
        if (response.result.success) {
          this.countries = response.result.data.countries;
          this.countries.unshift({ id: "add_country", name: "Add Country" });
          this.currencyX = response.result.data.currency;
        }
      })
      .catch((error) => console.log(error));
  }

  public noWhitespaceValidator(control: FormControl) {
    // let isWhitespace = (control.value || "").trim().length === 0;
    // let isValid = !isWhitespace;
    // return isValid ? null : { whitespace: true };
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }
  public noZeroValidator(control: FormControl) {
    //console.log(control.value)
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      company_name: [
        this.data?.company_name || null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      website: [null, [Validators.pattern(this.websitePattern)]],
      status: [
        null,
        this.data?.type != "estimate" ? Validators.required : null,
      ],
      currency_id: [null, Validators.required],
      pfi_number_series: [
        null,
        [Validators.required, Validators.pattern(this.NUMBER_PATTERN)],
      ],
      pfi_end_series: [
        null,
        !this.is_automech
          ? [
              Validators.required,
              Validators.pattern(this.NUMBER_PATTERN),
              CustomValidation.notZeroValidator(),
            ]
          : [],
      ],
      org_pfi_prefix: [
        null,
        [Validators.required, Validators.pattern(this.ClientNamePfiSeries)],
      ],
      port_of_loading: [null, [this.noWhitespaceValidator]],
      port_of_discharge: [null, [this.noWhitespaceValidator]],
      final_destination: [null, [this.noWhitespaceValidator]],
      preferential_agreement: [
        null,
        this.is_automech ? [Validators.required] : null,
      ],
      end_usecode: [null, this.is_automech ? [Validators.required] : null],
      country_id: [null, Validators.required],
      addCountry: [null],
      firstname: [
        null,
        this.data?.type === "estimate"
          ? [Validators.required, this.noWhitespaceValidator]
          : null,
      ],
      lastname: [
        null,
        this.data?.type == "estimate"
          ? [Validators.required, this.noWhitespaceValidator]
          : null,
      ],
      email: [
        null,
        this.data?.type == "estimate"
          ? [
              Validators.required,
              Validators.pattern(CustomValidation.EMAIL_REGEX),
            ]
          : null,
      ],
      primary_phone: [
        null,
        this.data?.type == "estimate"
          ? [Validators.required, Validators.pattern("^\\+?[0-9\\-\\s]+$")]
          : null,
      ],
    });
  }

  public organisation_id;
  addOrg(form: any): void {
    console.log(form, this.detailsForm);
    let toast: object;
    // this.detailsForm.controls?.storeCustomAttributes?.controls[0].get("company_name").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("pfi_number_series").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("pfi_end_series").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("org_pfi_prefix").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("status").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("currency_id").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("country_id").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("port_of_loading").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("port_of_discharge").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("final_destination").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("email").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("firstname").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("lastname").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("primary_phone").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("preferential_agreement").markAsTouched();
    // this.detailsForm.controls.storeCustomAttributes.controls[0].get("end_usecode").markAsTouched();
    if (!form.valid) return;

    // if (this.uploads.length) {
    //   this.detailsForm.value.storeCustomAttributes[0][
    //     this.uploads[0].form_control_name
    //   ] = this.uploads[0].attachments_id;
    // }
    // let param = Object.assign(
    //   {},
    //   this.detailsForm.value.storeCustomAttributes[0]
    // );
    let param: any = {
      form_data: this.detailsForm.value.storeCustomAttributes[0],
      moduleName: this.moduleName
    };

    if (this.data?.type == "estimate") {
      param.status = true;
    }
    this.utilsService.saveStoreAttribute(param).then((res) => {
      console.log(res);
      if (res.success) {
        setTimeout(() => {
          this.trigger.closed = true;
          this.dialogRef.close({ success: true, response: res.data.new_data });
          toast = { msg: res.message, status: "success" };
          this.snackbar.showSnackBar(toast);
        }, 1000);
      } else {
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });

    // param['type'] = 'client';

    // if (this.uploads.length) {
    //   param.filename = this.uploads[0].filename;
    //   param.original_name = this.uploads[0].original_name;
    //   param.src_name = this.uploads[0].source_path;
    // }
    // this.disabledSave = false;
    // this.showSpinner = true;
    // this.organizationsService.addorganizations(param).then((response) => {
    //   if (response.result.success) {
    //     this.detailsForm.markAsPristine();
    //     this.organisation_id = response.result.data[0].id;
    //     this.Organization = response.result.data[0];

    //     setTimeout(() => {
    //       // this.addContacts();
    //       this.trigger.closed = true;
    //       this.dialogRef.close({ success: true, response: this.Organization });
    //     }, 1000);
    //     this.uploadError = false;
    //     this.sizeError = false;
    //     this.showSpinner = false;
    //   } else {
    //     toast = { msg: response.result.message, status: "error" };
    //     this.snackbar.showSnackBar(toast);
    //     this.showSpinner = false;
    //     this.disabledSave = false;
    //   }
    // });
  }
  cancelOrg() {
    this.sizeError = false;
    this.uploadError = false;
  }

  onCountryChange(event): void {
    if (event.value == "add_country") {
      this.detailsForm.get("addCountry").setValidators([
        Validators.required,
        this.noWhitespaceValidator,
        this.noZeroValidator,
        // Validators.pattern(/^[a-zA-Z0-9\s]+$/),
      ]);
      this.submitCountry = true;
    } else {
      this.submitCountry = false;
    }
  }

  addCountry(country: any) {
    if (country.value.addCountry) {
      this.adminService
        .addCountry({ name: country.value.addCountry })
        .then((response) => {
          if (response.result.success) {
            this.submitState = true;
            this.submitCountry = false;
            this.getOrganizationDetails();
            this.detailsForm.patchValue({
              country_id: response.result.data.id,
            });
            // this.detailsForm.get("addCountry").reset();
          } else {
            let toast: object;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        });
    }
  }
  public phoneErrorMsg = false;
  public phoneValue;
  onPhoneChanges(event) {}
  addContacts() {
    this.adminService
      .OrganizationContacts({
        organization_id: this.organisation_id,
        primary_email: this.detailsForm.controls.email.value,
        first_name: this.detailsForm.controls.firstname.value,
        last_name: this.detailsForm.controls.lastname.value,
        primary_phone: this.detailsForm.controls.primary_phone.value,
      })
      .then((response) => {
        if (response.result.success) {
          this.showSpinner = false;
        } else {
        }
      });
  }
  public endusearray = [
    { name: "GNX100- For Trading - Wholesale or Retail", id: "GNX100" },
    { name: "GNX200 -For Manufacture-Actual use", id: "GNX200" },
    { name: "DCH400", id: "DCH400" },
    { name: "DCX200", id: "DCX200" },
  ];
  public applicableArray = [
    { name: "PTA", id: "PTA" },
    { name: "FTA", id: "FTA" },
  ];
  selectAgreement() {
    this.activestate = true;
  }
  selectEndUseCode() {
    this.activestate = true;
  }
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
  }

  emitUploadInfo(ev) {
    // this.uploads = ev.uploadList;
    // this.uploads[0].form_control_name = ev.uploadObject[0].form_control_name;
    this.moduleName = ev.module;
    this.uploads = ev.uploadList;
    this.detailsForm = ev.form;
    if (this.uploads.length) {
      this.detailsForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue({
          id: this.uploads[0].attachments_id,
          url: this.uploads[0].filepath,
        });
    } else {
      this.detailsForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue("");
    }
  }
}
