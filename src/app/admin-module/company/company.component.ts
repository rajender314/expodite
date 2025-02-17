import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient } from "@angular/common/http";

import { FileUploader } from "ng2-file-upload";
import { MatExpansionModule } from "@angular/material/expansion";
import { AddressComponent } from "../../dialogs/address/address.component";
import { BankdetailsComponent } from "../../dialogs/bankdetails/bank-details.component";

import { VendorAddressComponent } from "../../dialogs/vendor-address/vendor-address.component";

import { AlertMessageComponent } from "../../dialogs/alert-message/alert-message.component";
import { OrganizationsService } from "../../services/organizations.service";
import { ContactsComponent } from "../../dialogs/contacts/contacts.component";
import { ContactDeleteAlertComponent } from "../../dialogs/contact-delete-alert/contact-delete-alert.component";
import { AddressDeleteComponent } from "../../dialogs/address-delete/address-delete.component";
import { UsersService } from "../../services/users.service";
import { SnakbarService } from "../../services/snakbar.service";
import { language } from "../../language/language.module";
import { ViewEncapsulation } from "@angular/core";
import { trigger, style, transition, animate } from "@angular/animations";
import { MoreEmailsComponent } from "../../dialogs/more-emails/more-emails.component";
import { ClientInstructionComponent } from "../../dialogs/client-instruction/client-instruction.component";
import { DeleteInstructionsComponent } from "../../dialogs/delete-instructions/delete-instructions.component";
import { ViewInstructionComponent } from "../../dialogs/view-instruction/view-instruction.component";
import { VendorDelteInstrnsComponent } from "../../dialogs/vendor-delte-instrns/vendor-delte-instrns.component";
import { VendorInstructionsComponent } from "../../dialogs/vendor-instructions/vendor-instructions.component";
import { AdminService } from "../../services/admin.service";
import { Param } from "../../custom-format/param";
import { BankDeleteComponent } from "../../dialogs/bank-delete/bank-delete.component";
import { CustomValidation } from "../../custom-format/custom-validation";
import { LeadsService } from "../../leads/leads.service";
import { OrdersService } from "../../services/orders.service";

declare var App: any;

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyComponent implements OnChanges {
  @Input() Contacts;
  @Input() Organization;
  @Input() globalData;

  @Output() trigger = new EventEmitter<object>();
  @Output() change: EventEmitter<MatSlideToggleChange>;

  selectedOrganizations: object;
  public specialInstruction: Array<any> = [];
  public organizationDetails: Array<any> = [];
  private websitePattern =
    /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  detailsForm: FormGroup;
  public language = language;

  uploads = [];
  uploads1 = [];
  bankData: any;
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];

  currencyX: any[];
  fetchingData: boolean;
  activestate: boolean;
  uploadError = false;
  emptyContactsData: boolean = false;
  emptyAddressData: boolean = false;
  removeTabs: boolean = false;
  pointerEvent: boolean;
  submitCountry = false;
  countries: any;
  contactsList: Array<any> = [];
  contactDesignations: Array<any> = [];
  emailAddressTypes: Array<any> = [];
  phoneNumberTypes: Array<any> = [];
  groupArray: Array<any> = [];
  moreMails: boolean;
  sizeError: boolean;
  sizeError1: boolean;
  uploadError1 = false;
  noInstructions: boolean;
  clientCurrency: any;
  myProfile: boolean;
  adminUser: boolean;
  factoryProfile: boolean;
  public productsList: Array<any>;
  loading = true;
  public currencyabc: any;
  countriesStates: any;
  states: any;
  submitState = false;
  saveProduct = true;
  public companyDetails: any;
  public bankList: Array<any> = [];
  wordCount: number = 0;
  textareaContent: string = "";
  wordCountTerms: number = 0;
  textareaContentTerms: string = "";
  wordCountStandard: number = 0;
  textareaContentStandard: string = "";
  textareaContentvendorTerms: string = "";
  wordCountVendorTerms: number = 0;
  // public abc : any;
  totalSpinner: boolean;
  hide = true;
  private imageUploadUrl = App.base_url + "uploadCompanyLogo";
  public is_automech = App.env_configurations.is_automech;
  public hasDropZoneOver: boolean = false;
  public hasDropZoneOver1: boolean = false;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;

  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    additionalParameter: {
      type: "",
    },
    allowedMimeType: ["image/png", "image/jpeg", "image/jpg"],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public is_Vendor =
    App?.env_configurations?.client_env_config?.includes("vendors");
  fileNameType;
  constructor(
    public dialog: MatDialog,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private http: HttpClient,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    private leadService: LeadsService,
    private OrdersService: OrdersService
  ) {
    this.uploader.onAfterAddingFile = (item: any) => {
      this.uploader.options.additionalParameter = { type: this.fileNameType };
      // this.pointerEvent = true;
    };

    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      if (this.fileNameType == "company") {
        if (item.size >= options.maxFileSize) {
          // console.log('largeFile')
          this.sizeError = true;
          this.uploadError = false;
        } else {
          this.uploadError = true;
          this.sizeError = false;
        }
      } else if (this.fileNameType == "stamp") {
        if (item.size >= options.maxFileSize) {
          // console.log('largeFile')
          this.sizeError1 = true;
          this.uploadError1 = false;
        } else {
          this.uploadError1 = true;
          this.sizeError1 = false;
        }
      }
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      let obj = JSON.parse(response);
      if (obj.result.success && this.fileNameType == "company") {
        this.uploadError = false;
        this.sizeError = false;
        this.uploads = [];
        this.detailsForm.markAsDirty();
        this.activestate = true;
        this.uploads.push(obj.result.data);
      } else if (obj.result.success && this.fileNameType == "stamp") {
        this.uploadError1 = false;
        this.sizeError1 = false;
        this.uploads1 = [];
        this.detailsForm.markAsDirty();
        this.activestate = true;
        this.uploads1.push(obj.result.data);
      }
    };
  }
  public showSavePanel = false;
  deleteItem(index: number): void {
    // this.pointerEvent = false;
    this.activestate = true;

    this.uploads.splice(index, 1);
    this.showSavePanel = true;
  }
  deleteItem1(index: number): void {
    // this.pointerEvent = false;
    this.activestate = true;

    this.uploads1.splice(index, 1);
    this.showSavePanel = true;
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  setParameter(name) {
    this.fileNameType = name;
  }

  fileDrop(event): void {}
  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  fileSelected(event): void {
    // console.log(event,'sss')
  }

  ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.getFormModules();
    this.factoryProfile = true;
    this.generateDetailsForm();
    // this.getOrganization();
    this.getCompanyDetails();
    this.getOrganizationDetails();
    this.companyDetails = App["company_data"];
    this.activestate = false;
    let profile: boolean;
    let factory_profile: boolean;
    this.organizationsService.productsList.subscribe((productsListData) => {
      this.productsList = productsListData;
      // console.log(this.productsList)
    });

    this.organizationsService.clientCurrency.subscribe((message) => {
      this.clientCurrency = message;
      // console.log(message);
    });
    // console.log(this.clientCurrency)
    setTimeout(() => {
      let admin_profile: boolean;
      App.user_roles_permissions.map(function (val) {
        if (val.code == "client_interface") {
          if (val.selected) {
            profile = false;
          } else {
            profile = true;
          }
        }
        if (val.code == "factory_user") {
          if (val.selected) {
            factory_profile = true;
          } else {
            factory_profile = false;
          }
        }
        if (val.code == "admin") {
          if (val.selected) {
            admin_profile = true;
          } else {
            admin_profile = false;
          }
        }
      });
      this.myProfile = profile;
      this.factoryProfile = factory_profile;
      this.adminUser = admin_profile;
      // console.log(this.factoryProfile)
      this.loading = false;
    }, 1000);
  }

  // "factory_user"
  specialInstructionsList(): void {
    this.organizationsService
      .getlistOrgSpclIns({ vend_org_id: this.Contacts.id })
      .then((response) => {
        if (response.result.success) {
          this.specialInstruction = response.result.data.special_instructions;
          // console.log(this.specialInstruction.length)
        }
      })
      .catch((error) => console.log(error));
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log(tabChangeEvent);
    if (tabChangeEvent.index != 0) {
      this.activestate = false;
    }
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
          this.currencyX = response.result.data.currencyDt;
        }
      })
      .catch((error) => console.log(error));
  }
  // public noWhitespaceValidator(control: FormControl) {
  //   let isWhitespace = (control.value || "").trim().length === 0;
  //   let isValid = !isWhitespace;
  //   return isValid ? null : { whitespace: true };
  // }
  public noWhitespaceValidator(control: FormControl) {
    if (control.value && control?.value?.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
    // let isWhitespace = (control.value || "").trim().length === 0;
    // let isValid = !isWhitespace;
    // return isValid ? null : { whitespace: true };
  }
  public noZeroValidator(control: FormControl) {
    //console.log(control.value)
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  generateDetailsForm(): void {
    this.detailsForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      url: [null, [Validators.pattern(this.websitePattern)]],
      //status: [null, Validators.required],
      //attachments_id: "",
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          ),
        ],
      ],
      country_id: [null],
      currency_id: [null],
      phone_number: [null, [Validators.pattern(/^\+?[0-9]+$/)]],
      address1: [null, this.noWhitespaceValidator],
      address2: [null, this.noWhitespaceValidator],
      postal_code: [null, this.noWhitespaceValidator],
      tag_line: [null],
      description: [null],
      city: [null, this.noWhitespaceValidator],
      state_province_id: [null],
      bank_name: [null],
      add_code: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      eefc_ac_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      current_ac_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      pan_no: [
        null,
        [Validators.required, Validators.pattern("^[0-9a-zA-Z]*$")],
      ],
      iec_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      add_code_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      end_use: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      gstin_type: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      drug_license_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      fda_no: [null, [Validators.pattern("^[0-9a-zA-Z]*$")]],
      other_company_details: [null],
      terms_cond_des: [null],
      standard_declarations: [null],
      vendor_declarations: [null],

      ie_code: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern("^[0-9a-zA-Z]*$"),
              this.noWhitespaceValidator,
            ]
          : null,
      ],
      gstin_no: [null, [Validators.required]],
      sealing_permission_no: [
        null,
        [Validators.pattern("^[0-9a-zA-Z/-]*$"), this.noWhitespaceValidator],
      ],
      cin_no: [null, null],
      insurance_policy_no: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern("^[0-9a-zA-Z/]*$"),
              this.noWhitespaceValidator,
            ]
          : null,
      ],
      document_code: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern("^[0-9a-zA-Z]*$"),
              this.noWhitespaceValidator,
            ]
          : null,
      ],
      lut_no: [null],
      last_composite_invoice_number: [
        null,
        this.is_aapl
          ? [
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              // this.noWhitespaceValidator,
            ]
          : null,
      ],
      last_invoice_number: [
        null,
        this.is_aapl
          ? [
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              // this.noWhitespaceValidator,
            ]
          : null,
      ],
      einvoice_username: [null, [Validators.required]],
      einvoice_password: [null, [Validators.required]],
    });
    if(this.adminService.rolePermissions.edit_company == 2) {
      this.detailsForm.disable();
    } else if(this.adminService.rolePermissions.edit_company == 1){
      this.detailsForm.enable();
    }
  }

  setForm(data: any): void {
    this.detailsForm.patchValue({
      gstin_no: data.gstin_no,
      name: data.name,
      url: data.url,
      //status: data.status,
      country_id: data.country_id,
      attachments_id: data.attachments_id,
      currency_id: data.currency_id,
      bank_details: data.bank_details,
      phone_number: data.phone_number,
      email: data.email,
      state_province_id: data.state_province_id,
      city: data.city,
      description: data.description,
      tag_line: data.tag_line,
      address1: data.address1,
      address2: data.address2,
      postal_code: data.postal_code,
      bank_name: data.bank_name,
      add_code: data.add_code,
      eefc_ac_no: data.eefc_ac_no,
      current_ac_no: data.current_ac_no,
      pan_no: data.pan_no,
      iec_no: data.iec_no,
      add_code_no: data.add_code_no,
      end_use: data.end_use,
      gstin_type: data.gstin_type,
      drug_license_no: data.drug_license_no,
      fda_no: data.fda_no,
      intermediary_bank: data.intermediary_bank,
      beneficiary_bank: data.beneficiary_bank,
      terms_cond_des:
        data.terms_cond_des != null
          ? data.terms_cond_des.replace(/<br>/gi, "\n")
          : "",
      other_company_details: data.other_company_details,
      standard_declarations: data.standard_declarations,
      vendor_declarations: data.vendor_declarations,
      ie_code: data.ie_code,
      lut_no: data.lut_no,
      sealing_permission_no: data.sealing_permission_no,
      cin_no: data.cin_no,
      insurance_policy_no: data.insurance_policy_no,
      document_code: data.document_code,
      last_invoice_number: data.last_invoice_number,
      last_composite_invoice_number: data.last_composite_invoice_number,
      einvoice_username: data.einvoice_username,
      einvoice_password: data.einvoice_password,
    });
    this.uploads = [];
    // this.pointerEvent = false;
    if (data.logo) {
      // this.pointerEvent = true;
      let obj = {
        filename: data.logo,
        source_path: data.logo,
        original_name: data.logo,
      };
      this.uploads.push(obj);
    }
    this.uploads1 = [];
    if (data.stamp) {
      // this.pointerEvent = true;
      let obj = {
        filename: data.stamp,
        source_path: data.stamp,
        original_name: data.stamp,
      };
      this.uploads1.push(obj);
    }
  }

  cancel(form: any): void {
    this.uploadError = false;
    this.sizeError = false;
    this.sizeError1 = false;
    this.uploadError1 = false;

    form.markAsPristine();
    this.setForm(this.Contacts);
    this.activestate = false;
    this.submitCountry = false;
  }
  companydetailsData = [];
  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then((response) => {
        if (response.result.success) {
          this.countries = response.result.data.countries;
          (this.countriesStates = response.result.data.countriesStates),
            (this.currencyX = response.result.data.currency);
          this.states = response.result.data.states;
          this.companydetailsData = response.result.data.company_details;
          // this.Contacts=this.companydetailsData
          this.detailsForm.patchValue({
            // other_company_details:response.result.data.company_details.other_company_details,
            // terms_cond_des:response.result.data.company_details.terms_cond_des
          });
        }
      })
      .catch((error) => console.log(error));
  }
  getCompanyDetails(): void {
    this.organizationsService
      .getCompanyDetails()
      .then((response) => {
        if (response.result.success) {
          setTimeout(() => {
            this.updateWordCount();
            this.updateWordCountterms();
            this.updateWordCountStanderd();
            this.updateWordCountStanderdVendor();
          }, 1000);
          this.Contacts = response.result.data;

          this.setForm(this.Contacts);
        }
      })
      .catch((error) => console.log(error));
  }

  updateProducts(id) {
    this.saveProduct = false;
    setTimeout(() => {
      this.saveProduct = true;
    }, 0);
  }

  updateOrganization(form?: any): void {
    if (form.valid) {
      let toast: object;
      // const currentValue = this.detailsForm.get("terms_cond_des").value;
      // const updatedValue = currentValue.replace(/\n/g, "<br>");
      // this.detailsForm.get("terms_cond_des").setValue(updatedValue);
      this.totalSpinner = true;
      // console.log(form.valid);
      let param = Object.assign({}, form.value);
      //	param.id = this.Contacts.id;
      // param.status = this.Contacts.status;
      if (this.uploads.length) {
        param.filename = this.uploads[0].filename;
        param.original_name = this.uploads[0].original_name;
        param.src_name = this.uploads[0].source_path;
      }
      if (this.uploads1.length) {
        param.stamp = this.uploads1[0].filename;
      }

      this.organizationsService
        .saveCompanyDetails(param)
        .then((response) => {
          if (response.result.success) {
            form.markAsPristine();

            //this.Contacts = response.result.data[0];
            this.activestate = false;
            this.uploadError = false;
            this.uploadError1 = false;
            this.getCompanyDetails();
            this.sizeError = false;
            this.sizeError1 = false;
            this.showSavePanel = false;
            this.totalSpinner = false;
            //this.setForm(this.Contacts);
            //this.trigger.emit({ flag: this.Contacts.id, data: this.Contacts });
            toast = {
              msg: "Company Details Updated Successfully.",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          } else {
            this.totalSpinner = false;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  onStatusChange(data?: any): void {
    //  this.Contacts.status = data.value;
    this.activestate = true;
    //this.updateOrganization(this.detailsForm);
  }
  onCountryChange(data?: any, stateId?): void {
    if (this.detailsForm.value.country_id) {
      this.states = this.countriesStates
        ? this.countriesStates[this.detailsForm.value.country_id]
        : [];
      this.submitCountry = false;
      this.detailsForm.patchValue({
        state_province_id: stateId
          ? stateId
          : this.states
          ? this.states[0].id
          : "",
      });
    } else {
      this.submitCountry = true;
    }
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.getOrganizationDetails();
    this.uploadError = false;
    this.sizeError = false;
    this.sizeError1 = false;
    this.uploadError1 = false;

    this.fetchingData = true;
    this.activestate = false;
    this.organizationDetails = [];
    this.contactsList = [];
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.Contacts) {
      this.removeTabs = false;
      if (this.Contacts.id) {
        this.emptyContactsData = false;
        this.emptyAddressData = false;
        this.noInstructions = false;
        this.generateDetailsForm();
        this.specialInstructionsList();
        // this.updateWordCountStanderdVendor();
        //this.setForm(this.Contacts);
        this.organizationsService
          .ListAddress({ vend_org_id: this.Contacts.id })
          .then((response) => {
            this.fetchingData = false;
            if (response.result.data.address_organization) {
              this.organizationDetails =
                response.result.data.address_organization;
            } else {
              this.organizationDetails = [];
            }
          })
          .catch((error) => console.log(error));
        this.organizationsService
          .listContacts({ vend_org_id: this.Contacts.id })
          .then((response) => {
            if (response.result.data.contactsData) {
              this.contactsList = response.result.data.contactsData;
            } else {
              this.contactsList = [];
            }
            if (response.result.data.designationsDt) {
              this.contactDesignations = response.result.data.designationsDt;
            } else {
              this.contactDesignations = [];
            }
            if (response.result.data.emailAddressTypesDt) {
              this.emailAddressTypes = response.result.data.emailAddressTypesDt;
            } else {
              this.emailAddressTypes = [];
            }
            if (response.result.data.phoneNumberTypesDt) {
              this.phoneNumberTypes = response.result.data.phoneNumberTypesDt;
            } else {
              this.phoneNumberTypes = [];
            }
            if (response.result.data.groupsDt) {
              this.groupArray = response.result.data.groupsDt;
            } else {
              this.groupArray = [];
            }
          })
          .catch((error) => console.log(error));
      } else {
        this.emptyContactsData = true;
        this.emptyAddressData = true;
        this.noInstructions = true;
        this.removeTabs = true;
      }
    }
  }

  /* Contacts Module */

  updateOrganizationContacts(data?: any): void {
    let contacts = {
      id: "",
      contact: {
        description: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        designation_id: 0,
        primary_email: "",
        designation_name: "",
        primary_phone: "",
        contact_id: 0,
        vend_org_id: this.Contacts.id,
        vendor_cont: true,
      },
      emailArr: {
        email_address: "",
        email_address_type_id: 1,
        email_id: "",
        email_type: "",
        invalid: false,
      },
      phoneArr: {
        //phone_number: "",
        phone_number_type_id: 2,
        phone_id: "",
        invalid: false,
      },
      contactDesignations: this.contactDesignations,
      emailAddressTypes: this.emailAddressTypes,
      phoneNumberTypes: this.phoneNumberTypes,
      groupArray: this.groupArray,
    };
    if (data) Object.assign(contacts, data);

    let toast: object;

    let dialogRef = this.dialog.open(ContactsComponent, {
      panelClass: "alert-dialog",
      width: "540px",
      disableClose: true,
      data: contacts,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        if (contacts.contact.contact_id) {
          toast = { msg: "Contact updated successfully.", status: "success" };
          let organisationContactsList = [];
          this.contactsList.map(function (value) {
            if (value.contact.contact_id == contacts.contact.contact_id) {
              organisationContactsList.push(result.response);
            } else {
              organisationContactsList.push(value);
            }
          });
          this.contactsList = organisationContactsList;
          // console.log(this.contactsList)
        } else {
          toast = { msg: "Contact added successfully.", status: "success" };
          this.contactsList.push(result.response);
        }
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  selectDetail() {
    this.activestate = true;
  }

  moreEmail(data?: any, index?: any) {
    let toast: object;
    let dialogRef = this.dialog.open(MoreEmailsComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
      // height: '240px',
      // data: data
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  addCountry(country: any) {
    if (country.value.addCountry) {
      this.adminService
        .addCountry({ name: country.value.addCountry })
        .then((response) => {
          if (response.result.success) {
            this.submitCountry = false;
            this.getOrganizationDetails();
            this.detailsForm.patchValue({
              country_id: response.result.data.id,
            });
          }
        });
    }
  }

  addInstruction(data) {
    // console.log('nafhalif' ,data.id)
    let contacts = {
      vend_org_id: this.Contacts.id,
      id: data && data.id ? data.id : 0,
      name: data.name,
    };
    let toast: object;
    let dialogRef = this.dialog.open(VendorInstructionsComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      data: contacts,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.specialInstructionsList();
      }
    });
  }

  deleteIns(data?: any) {
    let toast: object;
    let contacts = {
      id: data.id,
    };
    let dialogRef = this.dialog.open(VendorDelteInstrnsComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        toast = {
          msg: "Special Instruction deleted successfully.",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.organizationsService
          .getDeleteOrgSpclInsApi({ id: contacts.id })
          .then((response) => {
            if (response.result.success) {
              this.specialInstructionsList();
            }
          });
      }
    });
  }
  viewIns(data) {
    let contacts = {
      name: data.name,
    };
    let toast: object;
    let dialogRef = this.dialog.open(ViewInstructionComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      data: contacts,
      disableClose: true,
    });
    // console.log(contacts)
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.specialInstructionsList();
      }
    });
  }
  bankdetailslist(moduleId) {
    setTimeout(() => {
      this.leadService
        .getModuleSavedList({
          related_to_id: "",
          form_id: moduleId,
        })
        .then((response) => {
          if (response.result.success) {
            // this.organizationDetails
            this.bankList = response.result.data.list;
          }
        })
        .catch((error) => console.log(error));
    }, 100);
  }
  public modulesList;
  public bankDetails_form_id;
  getFormModules() {
    this.adminService
      .getModules({})
      .then((response) => {
        if (response.result.success) {
          this.modulesList = response.result.data.modulesDt;
          const indx = this.modulesList.findIndex(
            (module) => module.slug === "bank_details"
          );
          if (indx > -1) {
            this.bankDetails_form_id = this.modulesList[indx].id;
            this.bankdetailslist(this.bankDetails_form_id);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  addBankdetails(data?: any) {
    let dialogRef = this.dialog.open(BankdetailsComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
      data: {
        prefill_id: data ? data?.id : "",
        form_module_name: "bank_details",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.bankdetailslist(this.bankDetails_form_id);
      }
    });
  }
  updateWordCount(): void {
    this.wordCount = this.textareaContent?.length;
  }
  updateWordCountterms(): void {
    this.wordCountTerms = this.textareaContentTerms.length;
  }
  updateWordCountStanderd(event?: any): void {
    this.wordCountStandard =
      this.textareaContentStandard?.replace(/<[^>]*>?/gm, "").length || 0;
    if (this.wordCountStandard >= 512 && event?.key !== "Backspace") {
      event?.preventDefault();
    }
  }
  handlePaste(
    event: ClipboardEvent,
    modelProperty: string,
    wordCountProperty: string,
    maxLength: number
  ): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData("text") || "";
    const textContent = this[modelProperty]?.replace(/<[^>]*>?/gm, "") || "";

    // Combine current text with pasted text
    const newTextContent = textContent + pastedText;

    if (newTextContent.length > maxLength) {
      // Truncate the combined text to maxLength characters
      const allowedText = newTextContent.substring(0, maxLength);
      this[modelProperty] = allowedText;
      this[wordCountProperty] = maxLength;
      event.preventDefault();
    } else {
      this[wordCountProperty] = newTextContent.length;
    }
  }
  updateWordCountStanderdVendor(event?: any): void {
    this.wordCountVendorTerms =
      this.textareaContentvendorTerms?.replace(/<[^>]*>?/gm, "").length || 0;
    if (this.wordCountVendorTerms >= 512 && event?.key !== "Backspace") {
      event?.preventDefault();
    }
  }
  deleteBank(data?: any) {
    let Bank = {
      id: "",
      bank_name: "",
    };
    Object.assign(Bank, data);
    let toast: object;
    // this.adminService.prdeleteBank({ id: Bank.id }).then((response) => {
    // console.log(response);
    Bank["msg"] = "Are you sure, you want to delete the Bank Data?";
    // response.result.data.data;
    let dialogRef = this.dialog.open(BankDeleteComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
      // height: '240px',
      data: Bank,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.OrdersService.deleteFromData({ id: Bank.id, type: "bank_details" })
          .then((response) => {
            if (response.result.success) {
              toast = {
                msg: "  Bank deleted successfully.",
                status: "success",
              };
              // console.log(this.organizationDetails);
              this.bankList = this.bankList.filter(function (value) {
                if (value.id == Bank.id) {
                  return false;
                }
                return true;
              });
              this.snackbar.showSnackBar(toast);
            }
          })
          .catch((error) => console.log(error));
      }
    });
    // });
  }
}
