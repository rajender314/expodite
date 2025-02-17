import { OrdersComponent } from "../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { Param } from "../../custom-format/param";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { Images } from "../../images/images.module";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UtilsService } from "../../services/utils.service";
declare var App: any;
@Component({
  selector: "app-change-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class ImportDocumentComponent implements OnInit {
  public type: any;
  clientsForm: FormGroup;
  contactAddressList: Array<any> = [];
  public fileUploadFlag: any;
  public language = language;
  OrdersList: Array<any> = [];
  shippingId: any;
  public hasDropZoneOver: boolean = false;
  orderNo: any;
  success: boolean;
  public App = App;
  public disabledSave = true;
  uploadImage: boolean;
  sizeError: boolean;
  uploads = [];
  description: any = "";
  public imageUploadUrl =
    App.base_url +
    `fileUpload?module=${this.data.module}&form_control_name=${this.data.formObject.form_control_name}&description=${this.description}`;
  pointerEvent: boolean;
  private uploadFilestatus: boolean;
  selectedFile: File;
  uploadfiledata;
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,

    // allowedMimeType: [ 'application/xlsx',],
    // maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public images = Images;
  originFileAttachments = [];
  errorMessage: string;
  disabledUpload: boolean = false;
  uploadError = false;
  public uploadErroMsg = ""
  public newUploads = []

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService
  ) {
    dialogRef.disableClose = true;
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      fileItem.formData.push({ 123: 234 });
      this.disabledUpload = true;
    };
    this.uploader.onAfterAddingFile = (item: any) => {
      this.pointerEvent = true;
    };
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      // this.uploadImage = true;
      if (item.size >= options.maxFileSize) {
        this.sizeError = true;
        this.uploadImage = false;
      } else {
        this.uploadImage = true;
        this.sizeError = false;
      }
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      let obj = JSON.parse(response);
      if (obj.result.success) {
        this.uploads.push(obj.result.data);
        this.uploadError = false;
        this.sizeError = false;
        this.uploadErroMsg = ""
        // console.log(this.data.formInfo)
        this.data.formInfo.controls.storeCustomAttributes["controls"][0]
        .get(this.data.formObject.form_control_name)
        ?.setValue(this.uploads);
        this.dialogRef.close({success: true,uploadList: this.uploads });

      } else {
        this.uploadError = true;
        this.uploadErroMsg = obj.result.message;
      }
    };
  }
  private param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
    flag: true,
  };
  genearateForm() {
    this.clientsForm = this.formBuilder.group({
      description: [null],
    });
  }

  ngOnInit() {
    this.type = this.data;
    // console.log(this.data);
    this.uploads = this.data.formInfo.value.storeCustomAttributes[0][this.data.uploadObject[0].form_control_name] || [];
  }

  public primaryOrder = {};

  public secondaryOrder: any;

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }
  fileDrop(event): void {
    this.errorMessage = "";
    this.uploadFilestatus = true;
    this.selectedFile = event[0];
    const allowedExtensions = ["xlsx", "xls"];
    const fileExtension = this.selectedFile.name.split(".").pop();
    if (this.selectedFile.size > 25 * 1024 * 1024) {
      this.errorMessage = "File size exceeds the maximum limit of 10MB.";
      this.selectedFile = null;
      this.uploadFilestatus = false;
    }
  }
  descriptionvalue(event) {
    this.description = event.target.value;
  }
  fileSelected(files: FileList, event?: any): void {
    // this.description=event.target.value
    this.selectedFile = files.item(0);
    this.errorMessage = "";
    this.uploadFilestatus = true;
    // Check file extension
    const allowedExtensions = ["xlsx", "xls"];
    const fileExtension = this.selectedFile.name.split(".").pop();
    if (this.selectedFile.size > 25 * 1024 * 1024) {
      this.errorMessage = "File size exceeds the maximum limit of 10MB.";
      this.selectedFile = null;
      this.uploadFilestatus = false;
    }
    // if (!allowedExtensions.includes(fileExtension)) {
    //   this.errorMessage = 'Invalid file format. Only XLSX , XLS files are allowed.';
    //   this.uploadFilestatus = false
    //   this.selectedFile = null; // Reset selected file
    // } else if (this.selectedFile.size > 25 * 1024 * 1024) {
    //   this.errorMessage = 'File size exceeds the maximum limit of 10MB.';
    //   this.selectedFile = null;
    //   this.uploadFilestatus = false
    // }
    this.uploader.setOptions({
      url:
        App.base_url +
        `fileUpload?module=${this.data.module}&form_control_name=${this.data.formObject.form_control_name}`
    });
  }
  public isSample: boolean;

  importFile(flag?: any): void {
    // console.log(this.uploads)
    // this.data.formInfo.controls.storeCustomAttributes["controls"][0]
    // .get(this.data.formObject.form_control_name)
    // ?.setValue([...this.uploads, ...this.newUploads]);

    let toast: object;
    setTimeout(() => {
      let param: any = {
        form_data: this.data.formInfo.value.storeCustomAttributes[0],
        organization_id: this.data.id,
        id: this.data.editID
      };
      let productIds = [];
      param.priceRange = [];
      this.utilsService.saveStoreAttribute(param).then((res) => {
  
        if (res.success) {
          toast = {
            msg: res.message,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close({success: true});
        } else {
          toast = {
            msg: res.message ? res.message : "Failed to Update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      });
    }, 500);
  }
  public getFileFlag: any;
}
