import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef,
  Injectable,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  NgForm,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { VERSION } from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";
import { Observable } from "rxjs/Observable";

import { AddressDeleteComponent } from "../../../dialogs/address-delete/address-delete.component";
import { Images } from "../../../images/images.module";
import { OrganizationsService } from "../../../services/organizations.service";

import * as _ from "lodash";

import { AdminService } from "../../../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { PermissionsService } from "../../../services/permissions.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { UtilsService } from "../../../services/utils.service";
import { OrderActivityLogComponent } from "../../../orders-module/order-activity-log/order-activity-log.component";
declare var App: any;

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-view-details",
  templateUrl: "./view-details.component.html",
  styleUrls: ["./view-details.component.scss"],
  animations: [
    trigger("AdminDetailsAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class ViewDetailsComponent implements OnInit, OnChanges {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() contacts;
  @Input() form_module_name;
  @Output() trigger = new EventEmitter<object>();
  @Input() form_name;
  @Input() noDataImage;
  @Input() namingConvention;
  @Input() isEditPerm;
  @Input() isAddPerm;

  detailsForm: FormGroup;
  fetchingData: boolean = true;
  contactSubmit: boolean;
  noContacts: boolean = true;
  deleteHide: boolean;
  pointerEvent: boolean;
  public addContacts = "Add";
  selectedContacts: any;
  private language = language;
  public images = Images;
  public viewActivityLogIcon: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {}
    public permissionKey = ""
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noContacts = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.contacts != undefined)
      if (!_.isEmpty(this.contacts)) {
        // this.addContacts = `Update Contact`;
        this.addContacts = `Update ${this.form_name}`;
        // this.detailsForm.reset();
        if (this.contacts.hasOwnProperty("flag")) {
          this.noContacts = true;
          this.deleteHide = true;
          this.selectedContacts = {};
        } else {
          this.noContacts = false;
          this.deleteHide = false;
          this.selectedContacts = this.contacts;
        }
      } else {
        this.noContacts = false;
        this.selectedContacts = {};
        this.addContacts = `Add ${this.form_name}`;
      }

      if(this.contacts && this.contacts.id) {
       
  
        if(this.form_module_name == "contact_addresses") {
          this.permissionKey = "edit_admin_contact_addresses"
        } else if(this.form_module_name == "customs_addresses") {
          this.permissionKey = "edit_admin_custom_addresses"
        } else if(this.form_module_name == "add_products") {
          this.permissionKey = "edit_product"
        }
      } else {
        if(this.form_module_name == "contact_addresses") {
          this.permissionKey = "add_admin_contact_addresses"
        } else if(this.form_module_name == "customs_addresses") {
          this.permissionKey = "add_admin_custom_addresses"
        } else if(this.form_module_name == "add_products") {
          this.permissionKey = "add_product"
        }
      }
     
  }

  ngOnInit() {
    this.addContacts = `Add ${this.form_name}`;

    let viewActivityLog: boolean;
    setTimeout(() => {
      let admin_profile: boolean;
      App.user_roles_permissions.map(function (val) {
        if (val.code == "activity_log") {
          if (val.selected) {
            viewActivityLog = true;
          } else {
            viewActivityLog = false;
          }
        }
      });
      this.viewActivityLogIcon = viewActivityLog;
    });
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  public moduleName;
  createForm(ev): void {
    this.detailsForm = ev.form;
    this.moduleName = ev.module;
    if(this.contacts && this.contacts.id) {
      if(this.isEditPerm) {
        this.detailsForm.enable();
      } else {
        this.detailsForm.disable();
      }

    } else {
      if(this.isAddPerm) {
        this.detailsForm.enable();
      } else {
        this.detailsForm.disable();
      }

    }
    
  }
  public undoOnCancel = false;
  cancel(form: any): void {
    this.contactSubmit = false;
    form.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 1000);
  }
  uploads = [];
  emitUploadInfo(ev) {
    console.log(ev)
    this.moduleName = ev.module;
    this.uploads = ev.uploadList || [];
    this.detailsForm = ev.form;
    console.log(ev)
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
  public conformsubmit;
  createContactAddress(form: any): void {
    if (!form.valid) return;

    this.contactSubmit = true;
    this.conformsubmit = true;

    let toast: object;
    let param: any = {
      form_data: form.value.storeCustomAttributes[0],
      moduleName: this.moduleName,
      id: this.selectedContacts.id || "",
    };
    let productIds = [];
    param.priceRange = [];
    this.utilsService.saveStoreAttribute(param).then((res) => {
      this.conformsubmit = false;
      //  this.totalSpinner = false;
      if (res.success) {
        toast = {
          msg: res.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.trigger.emit({
          flag: param.id,
          data: param.id ? this.selectedContacts : res.data.new_data,
        });
      } else {
        toast = {
          msg: res.message ? res.message : "Failed to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  onStatusChange(event) {
    // console.log(event)
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
        id: this.selectedContacts.id,
      },
    });
  }
}
