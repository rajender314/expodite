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
declare var App: any;
@Component({
  selector: "app-change-import",
  templateUrl: "./import.component.html",
  styleUrls: ["./import.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class ImportComponent implements OnInit {
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
    url: this.imageUploadUrl,
    additionalParameter: {
      import_type: this.data,
    },
    // allowedMimeType: [ 'application/xlsx',],
    // maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  errorMessage: string;
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
        this.sizeError = false;
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
    this.importSampleDownload();
    this.type = this.data;
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
    const fileInput = document.getElementById(
      "import-category"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ""; // Reset the file input value
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
  importFile(): void {
    if (this.data.clickedFrom && this.data.clickedFrom == "create_pfi") {
      this.OrdersService.getImportProductsList({
        filename: this.uploadfiledata.db_name,
        import_type: this.data.type || this.data,
        attachment_id: this.uploadfiledata.id,
      }).then((response) => {
        if (response.result.success) {
          this.success = false;
          this.dialogRef.close({ success: true, data: response.result.data });
          let toast: object;
          toast = { msg: "  File Imported Successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
        if (response?.result?.success == false) {
          this.dialogRef.close({ success: false });
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      this.importFileApi();
    }
  }

  public errorTableData;
  public displayedColumns: string[] = ["rowNumber", "rowErrors"];

  importFileApi(): void {
    this.adminService
      .importFile({
        filename: this.uploadfiledata.db_name,
        import_type: this.data.type || this.data,
        attachment_id: this.uploadfiledata.id,
      })
      .then((response) => {
        if (response.result.success) {
          if (response.result.data?.errors) {
            // this.errorMessage = response.result.data.errors
            //   .map((error) => {
            //     const formattedErrors = error.errors
            //       .map((err, index) => `${index + 1}. "${err}"`)
            //       .join("<br>");
            //     return `Row ${error.row}:<br>${formattedErrors}`;
            //   })
            //   .join("<br><br>");
            this.errorTableData = response.result.data.errors.map((error) => ({
              rowNumber: error.row,
              rowErrors: error.errors
                .map((err, index) => `<div>${index + 1}. ${err}</div>`)
                .join(""),
            }));
            return;
          }
          this.success = false;
          this.dialogRef.close({ success: true });
          let toast: object;
          toast = { msg: "  File Imported Successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
        if (response?.result?.success == false) {
          this.dialogRef.close({ success: false });
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
  }
}
