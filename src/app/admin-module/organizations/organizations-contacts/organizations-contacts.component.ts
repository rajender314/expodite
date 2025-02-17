import { ContactsViewService } from "./../../../services/contacts-view.service";
import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  CUSTOM_ELEMENTS_SCHEMA,
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
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { HttpClient } from "@angular/common/http";
import { FileUploader } from "ng2-file-upload";
import { AdminService } from "../../../services/admin.service";
import { AddressComponent } from "../../../dialogs/address/address.component";
import { OrganizationsService } from "../../../services/organizations.service";
import { ContactsComponent } from "../../../dialogs/contacts/contacts.component";
import { AddressDeleteComponent } from "../../../dialogs/address-delete/address-delete.component";
import { UsersService } from "../../../services/users.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { language } from "../../../language/language.module";
import { ViewEncapsulation } from "@angular/core";
import { trigger, style, transition, animate } from "@angular/animations";
import { MoreEmailsComponent } from "../../../dialogs/more-emails/more-emails.component";
import { ClientInstructionComponent } from "../../../dialogs/client-instruction/client-instruction.component";
import { DeleteInstructionsComponent } from "../../../dialogs/delete-instructions/delete-instructions.component";
import { ViewInstructionComponent } from "../../../dialogs/view-instruction/view-instruction.component";
import { AlertDialogComponent } from "../../../dialogs/alert-dialog/alert-dialog.component";
import { LeadsService } from "../../../leads/leads.service";
import * as _ from "lodash";
import { UtilsService } from "../../../services/utils.service";
import { OrdersService } from "../../../services/orders.service";
import { ErrorDialogComponent } from "../../../dialogs/error-dialog/error-dialog.component";
import { OrderActivityLogComponent } from "../../../orders-module/order-activity-log/order-activity-log.component";
import { Images } from "../../../images/images.module";

declare var App: any;

@Component({
  selector: "app-organizations-contacts",
  templateUrl: "./organizations-contacts.component.html",
  styleUrls: ["./organizations-contacts.component.scss"],
  // providers: [OrganizationsService, SnakbarService, AdminService],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("contactsAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("300ms ease-in", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),
  ],
})
export class OrganizationsContactsComponent implements OnChanges {
  @Input() Contacts;
  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();
  @Output() change: EventEmitter<MatSlideToggleChange>;

  selectedOrganizations: object;
  public specialInstruction: Array<any> = [];
  public organizationDetails: Array<any> = [];
  detailsForm: FormGroup;
  private language = language;
  uploads = [];
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
  noInstructions: boolean;
  clientCurrency: any;
  myProfile: boolean;
  adminUser: boolean;
  factoryProfile: boolean;
  public productsList: Array<any>;
  loading = true;
  public currencyabc: any;
  countriesStates: any;
  states: any[];
  submitState = false;
  saveProduct = true;
  public companyDetails: any;
  public selectedTabIndex = 0;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  // public abc : any;
  private imageUploadUrl = App.base_url + "uploadOrgImage";
  public is_automech = App.env_configurations.is_automech;
  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ["image/png", "image/jpeg", "image/jpg"],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public viewActivityLogIcon: boolean = false;
  public images = Images;
  constructor(
    public dialog: MatDialog,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private http: HttpClient,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    public contactsViewService: ContactsViewService,
    private leadService: LeadsService,
    private utilsService: UtilsService,
    private OrdersService: OrdersService
  ) {}

  deleteItem(index: number): void {
    // this.pointerEvent = false;
    this.activestate = true;
    this.uploads.splice(index, 1);
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}
  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  fileSelected(event): void {}

  ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    console.log(this.Organization);
    this.factoryProfile = true;
    this.companyDetails = App["company_data"];
    this.activestate = false;
    let profile: boolean;
    let viewActivityLog: boolean;
    let factory_profile: boolean;
    this.organizationsService.productsList.subscribe((productsListData) => {
      this.productsList = productsListData;
      console.log(this.productsList);
    });

    this.organizationsService.clientCurrency.subscribe((message) => {
      this.clientCurrency = message;
    });
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
        if (val.code == "activity_log") {
          if (val.selected) {
            viewActivityLog = true;
          } else {
            viewActivityLog = false;
          }
        }
      });
      this.myProfile = profile;
      this.factoryProfile = factory_profile;
      this.adminUser = admin_profile;
      this.viewActivityLogIcon = viewActivityLog;
      this.loading = false;
    }, 1000);

    setTimeout(() => {
      if (
        this.contactsViewService.contactRowdata &&
        this.contactsViewService.contactRowdata["org_id"] != undefined
      ) {
        this.selectedTabIndex = 1;
      } else {
        this.selectedTabIndex = 0;
      }
    }, 1000);
  }
  public tabIndex: number = 0;
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    if (tabChangeEvent.index != 0) {
      this.activestate = false;
    }
    if (tabChangeEvent.index == 1) {
      this.getOrgStoreAttribute("add_contact");
    }
    if (tabChangeEvent.index == 0) {
      this.getOrgStoreAttribute("add_address");
    }
    if (tabChangeEvent.index == 2) {
      this.getOrgStoreAttribute("account_manager");
    }
  }
  public undoOnCancel = false;

  cancel(form: any): void {
    this.uploadError = false;
    this.sizeError = false;
    this.detailsForm.markAsPristine();
    this.activestate = false;
    this.submitCountry = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
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
  updateProducts(id) {
    this.saveProduct = false;
    setTimeout(() => {
      this.saveProduct = true;
    }, 0);
  }

  updateOrganization(form?: any): void {
    if (form.valid) {
      let toast: object;
      this.submitCountry = false;
      console.log(this.uploads);
      let param = {
        form_data: form.value.storeCustomAttributes[0],
        organization_id: this.Contacts.id,
        id: this.Contacts.id,
        moduleName: this.moduleName,
      };
      this.utilsService.saveStoreAttribute(param).then((res) => {
        if (res.success) {
          toast = {
            msg: res.message,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.activestate = false;
          this.trigger.emit({
            flag: this.Contacts.id,
            data: form.value.storeCustomAttributes[0],
          });
          this.detailsForm.markAsPristine();
        } else {
          toast = {
            msg: res.message ? res.message : "Failed to update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
        this.detailsForm.markAsPristine();
      });
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.Contacts = changes?.Contacts?.currentValue;
    this.getOrganizationDetails();
    if (this.tabIndex == 1) {
      this.getOrgStoreAttribute("add_contact");
    } else if (this.tabIndex == 2) {
      this.getOrgStoreAttribute("account_manager");
    }
    {
      this.getOrgStoreAttribute("add_address");
    }
    this.uploadError = false;
    this.sizeError = false;
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
      } else {
        this.emptyContactsData = true;
        this.emptyAddressData = true;
        this.noInstructions = true;
        this.removeTabs = true;
      }
    }
  }

  deleteOrganizationAddress(data?: any, module?: any, type?: any): void {
    let toast;
    let dialogRef = this.dialog.open(ErrorDialogComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      data: {
        type: module,
        heading:
          module === "add_contact"
            ? "Delete Contact"
            : module === "account_manager"
            ? "Delete Manager"
            : "Delete Address",
        message:
          module === "add_contact" || module === "account_manager"
            ? `Are you sure you want to Delete ${data.first_name} ${data.last_name} ?`
            : "Are you sure, you want to Delete the Address ?",
        button: `Yes, Delete ${type}`,
        is_notError: true,
        icon: "delete",
        is_delete_id: data.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        toast = {
          msg: `${type} Deleted Successfully.`,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.getOrgStoreAttribute(module);
      }
    });
  }
  updateAddress(data?: any): void {
    console.log(data);
    let type: any;
    let address = {
      address1: "",
      address2: "",
      address_type_id: "",
      city: "",
      country_id: "",
      id: "",
      organization_id: "",
      org_id: this.Contacts.id,
      addressClientData: this.organizationDetails,
    };
    if (data) {
      Object.assign(address, data);
      type = "edit";
    } else {
      type = "add";
    }
    let toast: object;
    let dialogRef = this.dialog.open(AddressComponent, {
      panelClass: "alert-dialog",
      width: "600px",
      disableClose: true,
      data: {
        address: address,
        type: type,
        org_id: this.Contacts.id,
        prefill_id: data?.form_id ? data.form_id : "",
        id: data?.id ? data?.id : "",
        form_module_name: "add_address",
      },
    });
    // console.log(this.organizationDetails)
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.getOrgStoreAttribute("add_address");
      }
    });
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
        organization_id: this.Contacts.id,
      },
      emailArr: {
        email_address: "",
        email_address_type_id: 1,
        email_id: "",
        email_type: "",
        invalid: false,
      },
      phoneArr: {
        phone_number: "",
        phone_number_type_id: 2,
        phone_id: "",
        invalid: false,
      },
      component: "client",

      contactDesignations: this.contactDesignations,
      emailAddressTypes: this.emailAddressTypes,
      phoneNumberTypes: this.phoneNumberTypes,
      groupArray: this.groupArray,
    };
    if (data) Object.assign(contacts, data);

    let toast: object;
    console.log({
      contactdata: contacts,
      org_id: this.Contacts.id,
      form_module_name: "add_contact",
      editTypeForRestrict: data ? true : false,
    });
    let dialogRef = this.dialog.open(ContactsComponent, {
      panelClass: "alert-dialog",
      width: "540px",
      data: {
        contactdata: contacts,
        org_id: this.Contacts.id,
        form_module_name: "add_contact",
        editTypeForRestrict: data ? true : false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && result.success) {
        this.getOrgStoreAttribute("add_contact");
      }
    });
  }

  deleteOrganizationsContact(data?: any, index?: any): void {
    // delete contact api Here
  }
  selectDetail() {
    this.activestate = true;
  }

  moreEmail(data?: any, index?: any) {
    let toast: object;
    let dialogRef = this.dialog.open(MoreEmailsComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      // height: '240px',
      // data: data
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  addInstruction(data) {
    // console.log('nafhalif' ,data.id)
    let contacts = {
      org_id: this.Contacts.id,
      id: data && data.id ? data.id : 0,
      name: data.name,
    };
    let toast: object;
    let dialogRef = this.dialog.open(ClientInstructionComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      data: contacts,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
      }
    });
  }

  deleteIns(data?: any) {
    let toast: object;
    let contacts = {
      id: data.id,
    };
    let dialogRef = this.dialog.open(DeleteInstructionsComponent, {
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
      }
    });
  }

  checkModelType(msg: string, email: string): object {
    let data;
    switch (msg) {
      case "reset":
        data = {
          title: "Reset Password",
          url: "forgotPassword",
          msg:
            "Password Reset link will be sent to <b>'" +
            email +
            "'</b>. Are you sure you want to reset your password?",
          result: (data = { email }),
        };
        break;
    }
    return data;
  }

  openDialog(msg: string, email): void {
    let modelData = this.checkModelType(msg, email);
    //console.log(modelData);
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      panelClass: "alert-dialog",
      width: "600px",
      data: modelData,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }
  public moduleName = "";
  emitUploadInfo(ev) {
    this.activestate = true;
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
    this.detailsForm.markAsDirty();
  }
  formEmitEvent(ev) {
    // console.log(ev)
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
    this.activestate = true;
    if(this.adminService.rolePermissions.edit_client == 2) {
      this.detailsForm.disable();
    } else if(this.adminService.rolePermissions.edit_client == 1) {
      this.detailsForm.enable();
    }
  }
  public formModuleId = "";

  getContactList(moduleId) {
    this.leadService
      .getModuleSavedList({
        form_id: moduleId,
      })
      .then((response) => {
        if (response.result.data.list) {
          this.contactsList = response.result.data.list;
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
  }

  getAddressList(moduleId) {
    setTimeout(() => {
      this.leadService
        .getModuleSavedList({
          related_to_id: this.Contacts?.id || "",
          form_id: moduleId,
        })
        .then((response) => {
          if (response.result.success) {
            // this.organizationDetails
            this.organizationDetails = response.result.data.list;
          }
        })
        .catch((error) => console.log(error));
    }, 100);
  }

  async getOrgStoreAttribute(module) {
    await this.leadService
      .getOrgStoreAttributeList({
        module: module,
        related_to_id: this.Contacts?.id,
      })
      .then(async (response) => {
        if (response.result.success) {
          this.formModuleId = response.result.data.attributes.form_id;
          if (module == "add_contact" && this.adminService.rolePermissions.view_contact == 1) {
            this.getContactList(response.result.data.attributes.form_id);
          } else if (module == "account_manager" &&  this.adminService.rolePermissions.view_client_account_manager == 1) {
            this.getAccManagerList(response.result.data.attributes.form_id);
          } else if (module == "add_address" && this.adminService.rolePermissions.view_client_address_details == 1 && this.Contacts?.id) {
            this.getAddressList(response.result.data.attributes.form_id);
          }
        }
      })
      .catch((error) => console.log(error));
  }
  public managerList = [];
  getAccManagerList(moduleId) {
    this.leadService
      .getModuleSavedList({
        related_to_id: this.Contacts?.id || "",
        form_id: moduleId,
      })
      .then((response) => {
        if (response.result.data.list) {
          this.managerList = response.result.data.list;
        } else {
          this.contactsList = [];
        }
      });
  }
  openActivityModal(type): void {
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        module: type,
        id: this.Contacts?.id,
      },
    });
  }
}
