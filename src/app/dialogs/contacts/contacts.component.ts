import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ChangeDetectorRef,
} from "@angular/core";
import * as _ from "lodash";
import { OrganizationsService } from "../../services/organizations.service";
import { FormGroup, FormArray } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { language } from "../../language/language.module";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { Subscription } from "rxjs";
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
  providers: [OrganizationsService],
})
export class ContactsComponent implements OnInit {
  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();
  @Output() itemDeleted = new EventEmitter<{ index: number }>();
  contactsForm: FormGroup;
  checkedArr = [];
  mailListArray: FormArray;
  checkedStatus: any = {};
  deletedEmailArray = [];
  deletedPhoneNumberArray = [];
  numberListArray: FormArray;
  public language = language;
  designationData: any[];
  emailTypes: any[];
  contactTypes: any[];
  showError: boolean;
  selected = 1;
  selectedN = 2;
  mailNumberParse: string;
  panelOpenState: boolean = false;
  public errorMsg;
  public disabledSave = false;
  public showSpinner = false;
  public activestate;
  public selectedOrg = "";
  public endusearray = [
    { name: "Buyer", id: "1" },
    { name: "Consignee", id: "2" },
  ];
  apiResponseSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<ContactsComponent>,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    dialogRef.disableClose = true;
    if (data.groupsArr) {
      this.defaultChecked(data.groupsArr);
      this.checkedArr = data.groupsArr;
    }
  }

  defaultChecked(checkedArr): void {
    _.map(checkedArr, (group) => {
      this.checkedStatus[group] = true;
    });
  }
  ngOnInit() {
    this.selectedOrg = this.data.org_id;
  }

  updateChecked(groupname, event) {
    if (event.checked) {
      this.checkedArr.push(groupname.id);
      this.showError = false;
    } else {
      let index = this.checkedArr.indexOf(groupname.id);
      if (index > -1) {
        this.checkedArr.splice(index, 1);
      }
    }
    // console.log(this.checkedArr)
  }
  priceValidation(event: any) {
    const pattern = /^[0-9]{0,7}?.[0-9]{0,1}$/;
    if (event.target.value.length > 0) {
      if (pattern.test(event.target.value)) {
        return true;
      } else {
        event.preventDefault();
      }
    }
  }
  public isUserAccess = 0;
  giveUserAccess(event) {
    // console.log(event)
    this.disableSave = false;
    this.isUserAccess = event.checked ? 1 : 0;
  }
  public disableSave = true;
  valChanged() {
    this.disableSave = false;
  }

  addContact(form: any): void {
    console.log(form);
    let toast: object;
    this.disabledSave = true;
    let param = {
      form_data: form.value.storeCustomAttributes[0],
      organization_id: this.data.contactdata?.contact?.organization_id || "",
      id: this.data.contactdata.id,
      moduleName: this.moduleName,
    };
    if (this.data.form_module_name == "add_contact") {
      param.form_data.give_user_access =
        typeof param.form_data.give_user_access === "boolean"
          ? param.form_data.give_user_access
          : false;
    }
    this.utilsService
      .saveStoreAttribute(param)
      .then((res) => {
        if (res.success) {
          toast = {
            msg: res.data.new_data
              ? `${
                  this.data.form_module_name == "account_manager"
                    ? "Manager"
                    : "Contact"
                } Added Successfully`
              : `${
                  this.data.form_module_name == "account_manager"
                    ? "Manager"
                    : "Contact"
                } Updated Successfully`,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.trigger.closed = true;
          this.dialogRef.close({ success: true, response: res.data.new_data });
        } else {
          this.disabledSave = false;
          toast = {
            msg: res.message ? res.message : "Unable to Update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      })
      .catch((err) => {
        console.error(err);
        this.disableSave = false;
      });
  }

  changeTaxrate(value: string) {
    let match = value.match(/0\.\d{1,3}/);
    if (!match) {
      return;
    }
  }
  selectEndUseCode() {
    this.activestate = true;
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.contactsForm = ev.form;
  }
  emitUploadInfo(ev) {}
}
