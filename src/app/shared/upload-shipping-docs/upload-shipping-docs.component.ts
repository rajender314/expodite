import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { OrdersService } from "../../services/orders.service";
import { Images } from "../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { Lightbox } from "ngx-lightbox";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import * as _ from "lodash";
import { AdminService } from "../../services/admin.service";
declare var App: any;
@Component({
  selector: "app-upload-shipping-docs",
  templateUrl: "./upload-shipping-docs.component.html",
  styleUrls: ["./upload-shipping-docs.component.scss"],
})
export class UploadShippingDocsComponent implements OnInit {
  @Input() selectedOrderStatus: any;
  @Input() labelName;
  @Input() module: any;
  @Input() formObject;
  @Input() formInfo;
  @Input() editID;
  @Input() uploadedFile;
  @Output() trigger: any = new EventEmitter();
  @Input() isDisabled;
  @Input() uploadObject;
  @Input() PermissionKey: any;
  editShipping: boolean = true;
  pointerEvent: boolean;
  blockContent: boolean;
  public imagUploadFlag: any;
  imageUploadUrl;
  public uploader: FileUploader = new FileUploader({
    url: "",
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public images = Images;
  public shippingAttachments = [];
  suppllierDocumentss: FormGroup;

  attachments = [];
  originFileAttachments = [];
  insuranceAttachments = [];
  airwayAttachments = [];
  suppllierDocuments = [];
  salesDocuments = [];
  otherOrderAttachments = [];
  invalidText: boolean;
  uploadError: boolean;
  sizeError: boolean;
  public userDetails: any;

  public onLoadFiles = [
    "origin",
    "insuranceFlag",
    "shipping",
    "Bill",
    "landing",
    "supplier",
    "sales",
    "otherOrderSupplier",
  ];

  public fileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/xlsx",
  ];
  downloadStatus: boolean;
  public hasDropZoneOver: boolean = false;
  public orderId = "";
  constructor(
    private OrdersService: OrdersService,
    public dialog: MatDialog,
    private router: Router,
    private _lightbox: Lightbox,
    private formBuilder: FormBuilder,
    private snackbar: SnakbarService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    public adminService: AdminService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
  }
  generateSupplierDescription() {
    this.suppllierDocumentss = this.formBuilder.group({
      description: [null],
    });
  }
  getAttachmentsList() {
    this.OrdersService.getAttachmentsList({
      orders_id: this.orderId,
    }).then((response) => {
      if (response.result.success) {
        this.attachments = response.result.data.OrdersAtt;
        this.downloadStatus = response.result.data.dwmStatus;
      } else {
        this.attachments = [];
      }
    });
  }

  ngOnInit(): void {
    this.userDetails = App.user_details;
    if (this.formInfo) {
      this.formInfo.valueChanges.subscribe((val) => {
        // console.log(val);
      });
    }
  }

  public getFileFlag: any;
  public supplierDescr;
  ngOnChanges(changes: any): void {
    // console.log(changes);
    this.shippingAttachments = [];
    if (changes.uploadedFile && changes.uploadedFile.currentValue) {
      let obj = {
        filename: "",
        filepath: changes?.uploadedFile?.currentValue?.url || "",
        original_name: "",
      };
      this.shippingAttachments = this.uploadedFile;
    } else {
      this.shippingAttachments = [];
    }
    // console.log(this.shippingAttachments);
  }

  setSupplierForm(data) {
    if (this.suppllierDocumentss) {
      this.suppllierDocumentss.patchValue({
        description: data?.description,
      });
    }
  }
  public shipmentType;
  setAddedFilesUrl(flag) {
    if (flag == "origin") {
      this.imagUploadFlag = "country";
    } else if (flag == "insuranceFlag") {
      this.imagUploadFlag = "insurance";
    } else if (flag == "shipping") {
      this.imagUploadFlag = "shipping";
    } else if (flag == "landing") {
      this.imagUploadFlag = "landing";
    } else if (flag == "supplier") {
      this.imagUploadFlag = "supplier";
    } else if (flag == "sales") {
      this.imagUploadFlag = "sales";
    } else if (flag == "otherOrder") {
      this.imagUploadFlag = "otherOrder";
    } else {
      this.imagUploadFlag = "Bill";
    }
    this.shipmentType = flag;
    this.uploader.setOptions({
      url:
        App.base_url +
        `fileUpload?module=${this.module}&form_control_name=${this.formObject.form_control_name}`,
    });
  }
  uploadSupplier(flag?: any) {

    if (flag == "country") {
      this.getFileFlag = "country";
    }
    if (flag == "otherOrderSupplier") {
      this.getFileFlag = "otherOrderSupplier";
    }
    this.setAddedFilesUrl(flag);
    this.uploader.setOptions({
      url:
        App.base_url +
        `fileUpload?module=${this.module}&form_control_name=${this.formObject.form_control_name}`,
    });

    let toast: object;
    let dialogRef = this.dialog.open(ImportDocumentComponent, {
      width: "550px",
      data: {
        id: this.orderId,
        flage: flag,
        module: this.module,
        formObject: this.formObject,
        formInfo: this.formInfo,
        editID: this.editID,
        uploadObject: this.uploadObject,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
        this.shippingAttachments = result.uploadList;
        this.trigger.emit({ success: true, uploadList: result.uploadList });
      }
    });
  }
  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}
  fileSelected(event): void {}
  setImageUrl() {
    this.imageUploadUrl =
      App.base_url +
      `fileUpload?module=${this.module}&form_control_name=${this.formObject.form_control_name}`;
    this.uploader.setOptions({ url: this.imageUploadUrl });
  }

  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }

  openPreview(file, i: number, flag): void {
    if (
      file.filepath.lastIndexOf(".pdf") == -1 &&
      file.filepath.lastIndexOf(".doc") == -1 &&
      file.filepath.lastIndexOf(".docx") == -1 &&
      file.filepath.lastIndexOf(".xlsx") == -1
    ) {
      if (flag == "origin") {
        this._lightbox.open(this.originFileAttachments, i);
      } else if (flag == "insurance") {
        this._lightbox.open(this.insuranceAttachments, i);
      } else if (flag == "shipping") {
        this._lightbox.open(this.shippingAttachments, i);
      } else if (flag == "supplier") {
        this._lightbox.open(this.suppllierDocuments, i);
      } else if (flag == "sales") {
        this._lightbox.open(this.salesDocuments, i);
      } else if (flag == "otherOrderSupplier") {
        this._lightbox.open(this.otherOrderAttachments, i);
      } else {
        this._lightbox.open(this.airwayAttachments, i);
      }
    } else {
      let dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: "850px",
        data: file,
      });
    }
  }

  downloadFile(file, i, flag) {
    console.log(file);
    // var downloadUrl =
    //   App.base_url +
    //   "downloadFile?filepath=" +
    //   file.filepath +
    //   "&original_name=" +
    //   file.original_name;
    window.open(file.filepath, "_blank");
  }
  public moduleName = "";
  deleteUploads(file, i, flag) {
    this.moduleName = this.module;
    if(this.formObject.slug == "upload_documents") {
      const indx = _.findIndex(
        this.formInfo.value.storeCustomAttributes[0][this.formObject.form_control_name],
        { attachments_id: file.attachments_id }
      );
  
      if (indx > -1) {
        this.formInfo.value.storeCustomAttributes[0][this.formObject.form_control_name].splice(
          indx,
          1
        );
      }
    }


    let toast: object;
    setTimeout(() => {
      let param: any = {
        form_data: this.formInfo.value.storeCustomAttributes[0],
        organization_id: this.orderId,
        id: this.editID,
        moduleName: this.moduleName,
      };
      this.utilsService.saveStoreAttribute(param).then((res) => {
        if (res.success) {
          toast = {
            msg: res.message,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
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
}
