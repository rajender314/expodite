import { Component, OnInit, Input, SimpleChange } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { OrganizationsService } from "../../../services/organizations.service";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../../language/language.module";
import { Images } from "../../../images/images.module";
import { SnakbarService } from "../../../services/snakbar.service";
import { Lightbox } from "ngx-lightbox";
import { PdfPreviewComponent } from "../../../dialogs/pdf-preview/pdf-preview.component";
declare var App: any;
@Component({
  selector: "app-organizations-certifications",
  templateUrl: "./organizations-certifications.component.html",
  styleUrls: ["./organizations-certifications.component.scss"],
  // providers: [OrganizationsService],
})
export class OrganizationsCertificationsComponent implements OnInit {
  @Input() Organization;
  public currencyData: any;
  private language = language;
  public images = Images;
  public imagUploadFlag = "certificates";
  adminUser: boolean;

  productId: any;
  count = 0;
  certificationAttachments = [];
  public attachments = [];
  pointerEvent: boolean;
  invalidText: boolean;
  uploadError: boolean;
  sizeError: boolean;

  public fileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/xlsx",
  ];
  public imageUploadUrl = App.base_url + "uploadProductCertificate?";
  // public screenOrientation: any;
  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    // allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  constructor(
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    private _lightbox: Lightbox,
    public dialog: MatDialog
  ) {
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      // fileItem.url = App.base_url + 'addOrderAtt?orders_id=' + this.orders.selectedOrder.id;
    };

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      return { fileItem, progress };
    };

    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      let chunks = item.name.split(".");
      let extension = chunks[chunks.length - 1].toLowerCase();
      if (extension == "pdf") {
        item.type = "application/pdf";
      } else if (extension == "docx") {
        item.type =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (extension == "doc") {
        item.type = "application/msword";
      } else if (extension == "xlsx") {
        item.type = "application/xlsx";
      } else if (extension == "jpg") {
        item.type = "image/jpg";
      } else if (extension == "png") {
        item.type = "image/png";
      } else if (extension == "jpeg") {
        item.type = "image/jpeg";
      }

      let index = this.fileTypes.indexOf(item.type);
      if (
        item.size >= options.maxFileSize &&
        item.type == this.fileTypes[index]
      ) {
        this.sizeError = true;
        let toast: object;
        toast = { msg: "File size exceeds max limit(5 mb)", status: "error" };
        this.snackbar.showSnackBar(toast);
      } else {
        this.fileValidation(item, true);
      }
    };

    this.uploader.onAfterAddingFile = (item: any) => {
      this.pointerEvent = true;
      this.invalidText = false;
      let chunks = item.file.name.split(".");
      let extension = chunks[chunks.length - 1].toLowerCase();
      if (extension == "pdf") {
        item.file.type = "application/pdf";
      } else if (extension == "docx") {
        item.file.type =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (extension == "doc") {
        item.file.type = "application/msword";
      } else if (extension == "xlsx") {
        item.file.type = "application/xlsx";
      } else if (extension == "jpg") {
        item.file.type = "image/jpg";
      } else if (extension == "png") {
        item.file.type = "image/png";
      } else if (extension == "jpeg") {
        item.file.type = "image/jpeg";
      }
      this.fileValidation(item.file, true);
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (!this.fileValidation(item.file, false)) {
        this.uploadError = false;
        this.sizeError = false;
        return;
      }
      // console.log(response)
      let obj = JSON.parse(response);
      if (obj.result.success) {
        let toastMsg: object;
        toastMsg = { msg: "File uploaded successfully", status: "success" };
        this.snackbar.showSnackBar(toastMsg);
        if (!obj.result.data.error_format) {
          this.uploadError = false;
          this.sizeError = false;
          obj.result.data.OrdersAtt.forEach((element) => {
            element.src = "";
            if (element.link_url.lastIndexOf(".pdf") > -1) {
              element.src = this.images.pdf_download;
            } else if (
              element.link_url.lastIndexOf(".doc") > -1 ||
              element.link_url.lastIndexOf(".docx") > -1 ||
              element.link_url.lastIndexOf(".xlsx") > -1
            ) {
              // element.link_url = 'https://expodite.enterpi.com/storage/app/public/uploads/orders_po/1603187880.docx';
              // element.src = 'http://docs.google.com/gview?url='+ element.link_url +'&embedded=true';
            } else {
              element.src = element.link_url;
            }
          });
          this.certificationAttachments = obj.result.data.OrdersAtt;
        } else {
          this.invalidText = true;
        }
      } else {
        let toastMsg: object;
        toastMsg = { msg: "Error while uploading", status: "error" };
        this.snackbar.showSnackBar(toastMsg);
      }
    };
  }

  public productTypes: Array<any> = [];
  public OrgProductTypes: Array<any> = [];
  productValue(val) {
    // console.log(val);
  }
  fileValidation(item: any, showToast: any) {
    let index = this.fileTypes.indexOf(item.type);
    if (item.type != this.fileTypes[index]) {
      let toast: object;
      this.uploadError = true;
      toast = {
        msg: "Invalid file format.Supported file type(.jpg, .jpeg, .png, .pdf, .doc, .docx, .xlsx)",
        status: "error",
      };
      if (showToast) {
        this.snackbar.showSnackBar(toast);
      }
      this.uploader.cancelItem;
      return false;
    }
    return true;
  }
  ngOnInit() {
    this.getProductTypesData();
    let admin_profile: boolean;
    setTimeout(() => {
      App.user_roles_permissions.map(function (val) {
        if (val.code == "admin") {
          if (val.selected) {
            admin_profile = true;
          } else {
            admin_profile = false;
          }
        }
      });
      this.adminUser = admin_profile;
    }, 1000);
  }
  // fileSelectedvalue(event): void {
  // 	// console.log(this.count);
  // 	if (this.count === 0) {
  // 		this.uploader.setOptions({ url: App.base_url + 'uploadProductCertificate?products_id=' + event.id });
  // 		this.productId = event.id;
  // 		this.count++;
  // 	}

  // }
  setAddedFilesUrl(event) {
    this.uploader.setOptions({
      url:
        App.base_url +
        "uploadProductCertificate?products_id=" +
        event.id +
        "&org_id=" +
        this.Organization.id +
        "",
    });
  }
  fileSelected(event): void {}
  getAddedFiles(product_id) {
    this.organizationsService
      .getCertAttachDetails({
        product_id: product_id,
        org_id: this.Organization.id,
      })
      .then((response) => {
        if (response.result.success) {
          response.result.data.product_attachments.forEach((element) => {
            element.src = "";

            if (element.link_url.lastIndexOf(".pdf") > -1) {
              element.src = this.images.pdf_download;
            } else if (
              element.link_url.lastIndexOf(".doc") > -1 ||
              element.link_url.lastIndexOf(".docx") > -1 ||
              element.link_url.lastIndexOf(".xlsx") > -1
            ) {
              // element.link_url = 'https://expodite.enterpi.com/storage/app/public/uploads/AddedFiles/1603190571.xlsx';
              // element.src = 'http://docs.google.com/gview?url='+ element.link_url +'&embedded=true';
            } else {
              element.src = element.link_url;
            }
          });
          this.certificationAttachments =
            response.result.data.product_attachments;
        } else {
          this.certificationAttachments = [];
        }
      });
  }
  openPreview(file, i: number): void {
    console.log(file.link_url);
    if (
      file.link_url.lastIndexOf(".pdf") == -1 &&
      file.link_url.lastIndexOf(".doc") == -1 &&
      file.link_url.lastIndexOf(".docx") == -1 &&
      file.link_url.lastIndexOf(".xlsx") == -1
    ) {
      this._lightbox.open(this.certificationAttachments, i);
    } else {
      let dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: "850px",
        data: file,
        disableClose: true,
      });
    }
  }
  downloadFile(file, i) {
    var downloadUrl =
      App.base_url +
      "downloadFile?link_url=" +
      file.link_url +
      "&original_name=" +
      file.original_name;
    window.open(downloadUrl, "_blank");
  }
  deleteUploads(file, i, productId) {
    this.organizationsService
      .deleteProductsFiles({
        products_id: productId,
        attachments_id: file.att_id,
      })
      .then((response) => {
        if (response.result.success) {
          let toast: object;
          toast = { msg: "File deleted successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
          this.certificationAttachments.splice(i, 1);
          // this.getProductTypesData();
        }
      });
  }
  getProductTypesData(): void {
    this.organizationsService
      .getProductsList({ org_id: this.Organization.id })
      .then((response) => {
        if (response.result.success) {
          this.productTypes = response.result.data.productTypesDt;
          this.currencyData = response.result.data.currency;
          this.attachments = response.result.data.attach_arr;
          this.organizationsService.productsList.next(this.productTypes);
          this.organizationsService.clientCurrency.next(this.currencyData);

          // console.log(this.productTypes);
        }
      })

      .catch((error) => console.log(error));
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.Organization) {
      this.getProductTypesData();
    }
  }
}
