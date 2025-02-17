import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { OrdersService } from "../../services/orders.service";
import { Images } from "../../images/images.module";
import { AdminService } from "../../services/admin.service";

declare var App: any;
@Component({
  selector: "app-upload-logo",
  templateUrl: "./upload-logo.component.html",
  styleUrls: ["./upload-logo.component.scss"],
})
export class UploadLogoComponent implements OnInit {
  private imageUploadUrl = App.base_url + "fileUpload" + "?module=add_client";
  sizeError: boolean;
  uploadError = false;
  uploads: any = [];
  public hasDropZoneOver: boolean = false;
  public images = Images
  pointerEvent: boolean;
  public language = language;

  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    // allowedMimeType: ["image/png", "image/jpeg", "image/jpg"],
    // maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  // @Output() trigger: any = new EventEmitter();
  @Output() trigger = new EventEmitter<any>();
  // @Input() some: any
  @Input() editUpload: any;
  @Input() module: any;
  @Input() uploadedFile: any;
  @Input() formObject;
  @Input() PermissionKey;
  constructor(private orderService: OrdersService,
    public adminService: AdminService
    ) {
    // this.uploader.onBeforeUploadItem = (fileItem: any) => {
    //   fileItem.withCredentials = false; // Disable credentials if necessary
    //   fileItem.url = App.base_url + `fileUpload?module=${this.module}`;
    // };
    // this.uploader.onWhenAddingFileFailed = (
    //   item: any,
    //   filter: any,
    //   options: any
    // ) => {
    //   // this.uploadError = true;
    //   if (item.size >= options.maxFileSize) {
    //     this.sizeError = true;
    //     this.uploadError = false;
    //   } else {
    //     this.uploadError = true;
    //     this.sizeError = false;
    //   }
    // };
    // this.uploader.onAfterAddingFile = (item: any) => {
    //   // this.pointerEvent = true;
    // };
    // this.uploader.onCompleteItem = (
    //   item: any,
    //   response: any,
    //   status: any,
    //   headers: any
    // ) => {
    //   let obj = JSON.parse(response);
    //   if (obj.result.success) {
    //     this.uploads = [];
    //     this.uploads.push(obj.result.data);
    //     this.uploadError = false;
    //     this.sizeError = false;
    //     this.trigger.emit({uploadList: this.uploads})
    //   }
    // };
  }
  public uploadErroMsg = ""
  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res?.role_details?.roles_permissions;
    })

    if(this.module) {

    }
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      console.log(this.module);
      fileItem.withCredentials = false; // Disable credentials if necessary
      fileItem.url = App.base_url + `fileUpload?module=${this.module}&form_control_name=${this.formObject.form_control_name}`;
    };
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      // this.uploadError = true;
      if (item.size >= options.maxFileSize) {
        this.sizeError = true;
        this.uploadError = false;
      } else {
        this.uploadError = true;
        this.sizeError = false;
      }
    };
    this.uploader.onAfterAddingFile = (item: any) => {
      // this.pointerEvent = true;
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      let obj = JSON.parse(response);
      if (obj.result.success) {
        this.uploads = [];
        this.uploads.push(obj.result.data);
        this.uploadError = false;
        this.sizeError = false;
        this.trigger.emit({ uploadList: this.uploads });
      } else {
        this.uploadError = true;
        this.uploadErroMsg = obj.result.message;
        this.trigger.emit({ uploadList: [] });
      }
    };
  }

  ngOnChanges(changes: any): void {
    // console.log(changes)
    this.uploads = [];
    if (changes.uploadedFile && changes.uploadedFile.currentValue) {
      let obj = {
        filename: "",
        filepath: changes?.uploadedFile?.currentValue?.url || "",
        original_name: "",
      };
      if(changes?.uploadedFile?.currentValue?.url) {
        this.uploads.push(obj);
      }
    } else {
      this.uploads = [];
    }
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {
    // console.log(this.uploader.queue)
    // console.log(event)
  }

  fileSelected(event): void {}
  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.uploads.splice(index, 1);
    this.sizeError = false;
    this.trigger.emit({ uploadList: this.uploads });
  }
  onClick(event) {}
  onImageError(ev) {
    const target = ev.target as HTMLImageElement;
    target.src = this.images.removeIcon;
  }
}
