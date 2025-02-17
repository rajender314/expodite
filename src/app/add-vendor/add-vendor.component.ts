import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FileUploader } from "ng2-file-upload";
import { language } from "../language/language.module";
import { SnakbarService } from "../services/snakbar.service";
import { AdminService } from "../services/admin.service";

//services import//
import { OrganizationsService } from "../services/organizations.service";
import { UtilsService } from "../services/utils.service";
declare var App: any;
@Component({
  selector: "add-app-dialog",
  templateUrl: "./add-vendor.component.html",
  styleUrls: [
    "./add-vendor.component.scss",
    "../admin-module/organizations/organizations-contacts/organizations-contacts.component.scss",
  ],
})
export class AddVendorDialogComponent implements OnInit {
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
    private snackbar: SnakbarService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<AddVendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.selectedtype = this.status[0].param;
  }
  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.uploads.splice(index, 1);
    this.sizeError = false;
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}

  fileSelected(event): void {}

  public organisation_id;
  addOrg(form: any): void {
    console.log(form);
    let toast: object;
    if (!form.valid) return;
    let param: any = {
      form_data: this.detailsForm.value.storeCustomAttributes[0],
      moduleName: this.moduleName
    };

    if (this.data?.type == "estimate") {
      param.status = true;
    }
    this.disabledSave = true;
    this.showSpinner = true;

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
  }
  cancelOrg() {
    this.sizeError = false;
    this.uploadError = false;
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
  }

  emitUploadInfo(ev) {
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
