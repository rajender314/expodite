import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { OrdersComponent } from "../../orders-module/orders/orders.component";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import { OrdersService } from "../../services/orders.service";
declare var App: any;

@Component({
  selector: "app-products-import",
  templateUrl: "./products-import.component.html",
  styleUrls: ["./products-import.component.scss"],
})
export class ProductsImportComponent implements OnInit {
  public fetchingData = false;
  public type: any;
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
  uploads;
  private imageUploadUrl = App.base_url + "uploadFile";
  pointerEvent: boolean;
  private uploadFilestatus: boolean;
  selectedFile: File;
  uploadfiledata;
  public uploader: FileUploader = new FileUploader({
    url: this.data.clickedFrom == "add_packing" ? App.base_url + `fileUpload?module=${this.data.module}` : this.imageUploadUrl,
    additionalParameter: {
    },
    // allowedMimeType: [ 'application/xlsx',],
    // maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  errorMessage: string;
  public headerLabel = "Upload Files";
  public errorType = "";
  public sampleHeaders = [];
  public uploadedErrors = [];
  public uploadListErrors = [];
  packageListErrors: any;
  dataAdded: boolean;
  packingType: any;
  productData: any;
  disabledUpload = false;
  disbaleConform: boolean;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
        this.uploadfiledata = obj.result.data;
        this.uploads = obj.result.data;
        this.success = true;
        this.uploadImage = false;
        this.disabledUpload = false;
        this.sizeError = false;
      }
      if (this.uploadfiledata.error) {
        this.errorMessage = this.uploadfiledata.error;
        this.disabledUpload = true;
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

  ngOnInit() {
    // this.importSampleDownload();
    this.type = this.data.type;
    console.log(this.data);
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
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage =
        "Invalid file format. Only XLSX , XLS files are allowed.";
      this.uploadFilestatus = false;
      this.selectedFile = null; // Reset selected file
    } else if (this.selectedFile.size > 25 * 1024 * 1024) {
      this.errorMessage = "File size exceeds the maximum limit of 10MB.";
      this.selectedFile = null;
      this.uploadFilestatus = false;
    }
  }

  fileSelected(files: FileList): void {
    this.selectedFile = files.item(0);
    this.errorMessage = "";
    this.uploadFilestatus = true;
    // Check file extension
    const allowedExtensions = ["xlsx", "xls"];
    const fileExtension = this.selectedFile.name.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorMessage =
        "Invalid file format. Only XLSX , XLS files are allowed.";
      this.uploadFilestatus = false;
      this.selectedFile = null; // Reset selected file
    } else if (this.selectedFile.size > 25 * 1024 * 1024) {
      this.errorMessage = "File size exceeds the maximum limit of 10MB.";
      this.selectedFile = null;
      this.uploadFilestatus = false;
    }
  }
  public isSample: boolean;
  importSampleDownload(): void {
    this.adminService
      .sampleAvailable({
        type: this.data.type || this.data,
      })
      .then((response) => {
        this.isSample = response.result.is_sample_file;
        if (response.result.success) {
        }
      });
  }
  public importErrorMessage = "";
  public columnsData = [];
  public rowData = [];
  public cloneRowData = [];
  public listData = [];
  importFile(): void {
    this.disabledUpload = true;
    this.fetchingData = true;
    let importItems = {
      filename: this.uploadfiledata.db_name,
      attachment_id: this.uploadfiledata.id,
    };
    if (this.data.clickedFrom === "packing_list") {
      importItems["orders_id"] = this.data.orders_id;
      // filename: this.uploadfiledata.db_name,
      // attachment_id: this.uploadfiledata.id,
    }
    console.log(importItems);
    if(this.data.clickedFrom === "add_packing") {
      let importItems = {
        ...this.uploadfiledata,
        shipment_id: this.data.shipmentID,
        type: this.data.type 
       };
      this.OrdersService.getImportPackageList(importItems).then((response) => {
        if (response.result.success) {
          this.success = false;
          this.fetchingData = false;
          this.dialogRef.close({ success: true, data: response.result.data });
          let toast: object;
          toast = { msg: "  File Imported Successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
        if (response?.result?.success == false) {
          this.fetchingData = false;
          this.dialogRef.close({ success: false });
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
    this.OrdersService.getImportProductsList(importItems).then((response) => {
      if (response.result.success) {
        this.fetchingData = false;
        if (response.result.data.error) {
          console.log("jjk");
          this.headerLabel = response.result.data.error_log;
          this.sampleHeaders = response.result.data.sample_headers;
          this.uploadedErrors = response.result.data.uploaded_headers;
          this.importErrorMessage = response.result.data.message;
          this.errorType = response.result.data.type;
          this.uploadListErrors = response.result.data.list;

          if (this.errorType == "grid_list") {
            this.columnsData = response.result.data.column_data;
            this.cloneRowData = response.result.data.row_data;
            this.rowData = this.cloneRowData.slice(0, 5);
          }

          if (this.errorType == "list") {
            this.cloneRowData = response.result.data.list;
            this.listData = this.cloneRowData.slice(0, 5);
          }
        } else if (response.result.data.packingInfo) {
          this.headerLabel = "Packing List Summary";
          this.fetchingData = false;
          console.log("success");
          this.packageListErrors = response.result.data.packingInfo;
          this.packingType = response.result.data.type;
          this.productData = response.result.data.packingInfo.prodData;
          // this.cloneRowData = response.result.data.row_data;
          // this.rowData = this.cloneRowData.slice(0, 5);
          console.log(this.productData, "products");
          console.log(this.packageListErrors);
          this.dataAdded = true;
          this.success = false;
        } else {
          console.log("success");
          this.packageListErrors = response.result.data.packingInfo;
          this.success = false;
          this.dialogRef.close({ success: true, data: response.result.data });
          let toast: object;
          toast = { msg: "  File Imported Successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
      }
      if (response?.result?.success == false) {
        this.fetchingData = false;
        this.dialogRef.close({ success: false });
        let toast: object;
        toast = { msg: response.result.message, status: "error" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  }

  backToImport() {
    this.headerLabel = "Upload Files";
    this.dataAdded = false;
    this.disabledUpload = false;
  }
  isNumber(value: any): boolean {
    return !isNaN(value);
  }
  public vieworeText = "View More";
  onViewMore() {
    if (this.vieworeText == "View More") {
      this.vieworeText = "View Less";
      if (this.errorType == "grid_list") {
        this.rowData = this.cloneRowData.slice();
      } else {
        this.listData = this.cloneRowData.slice();
      }
    } else {
      this.vieworeText = "View More";
      if (this.errorType == "grid_list") {
        this.rowData = this.cloneRowData.slice(0, 5);
      } else {
        this.listData = this.cloneRowData.slice(0, 5);
      }
    }
  }
  conformPackage() {
    console.log(this.uploadfiledata)
    this.fetchingData = true;
    this.disbaleConform = true;
    let importItems = {
      filename: this.uploadfiledata.db_name,
      attachment_id: this.uploadfiledata.id,
    };
    if (this.data.clickedFrom === "packing_list") {
      importItems["orders_id"] = this.data.orders_id;
      importItems["is_confirmed"] = true;
      // filename: this.uploadfiledata.db_name,
      // attachment_id: this.uploadfiledata.id,
    }


      this.OrdersService.getImportProductsList(importItems).then((response) => {
        if (response.result.success) {
          this.success = false;
          this.fetchingData = false;
          this.dialogRef.close({ success: true, data: response.result.data });
          let toast: object;
          toast = { msg: "  File Imported Successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
        if (response?.result?.success == false) {
          this.fetchingData = false;
          this.dialogRef.close({ success: false });
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    

  }
}
