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
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { OrganizationsService } from "../../../services/organizations.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Images } from "../../../images/images.module";
import * as _ from "lodash";
import { AdminService } from "../../../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { FileUploader } from "ng2-file-upload";
import { UtilsService } from "../../../services/utils.service";
import { OrderActivityLogComponent } from "../../../orders-module/order-activity-log/order-activity-log.component";

declare var App: any;

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
  providers: [AdminService, SnakbarService, OrganizationsService],
  animations: [
    trigger("AdminDetailsAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() productType;
  @Input() categoryDt;
  @Output() trigger = new EventEmitter<object>();
  @Input() isEditPerm;

  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  conformsubmit: boolean;
  detailsForm: FormGroup;
  fetchingData: boolean;
  noProducts: boolean;
  deleteHide: boolean;
  pointerEvent: boolean;
  submitProduct: boolean;
  selectedProducts: any;
  uploads = [];
  categoryData = [];
  addProducts = "Add Product";
  public catName;
  public language = language;
  public images = Images;
  public defaultPrice = "0.00";
  public isEditMode = false;
  public activeState = false;
  public is_sso = App.env_configurations ? App.env_configurations.is_sso : true;
  public is_inventory =
    App?.env_configurations?.client_env_config?.includes("inventory");
  private imageUploadUrl = App.base_url + "addProductImage";
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;

  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    additionalParameter: {
      type: "",
    },
    allowedMimeType: ["image/png", "image/jpeg", "image/jpg"],
    maxFileSize: 10 * 1024 * 1024,
    autoUpload: true,
  });

  public fileNameType;
  sizeError: boolean;
  sizeError1: boolean;
  uploadError1 = false;
  uploadError = false;
  activestate: boolean;
  uploads1 = [];
  public hasDropZoneOver: boolean = false;
  undoOnCancel: boolean;
  public viewActivityLogIcon: boolean = false;
  constructor(
    private organizationsService: OrganizationsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    private utilsService: UtilsService
  ) {
    this.uploader.onAfterAddingFile = (item: any) => {
      this.uploader.options.additionalParameter = {
        type: this.fileNameType,
      };
    };
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      if (this.fileNameType == "company") {
        if (item.size >= options.maxFileSize) {
          this.sizeError = true;
          this.uploadError = false;
        } else {
          this.uploadError = true;
          this.sizeError = false;
        }
      } else if (this.fileNameType == "stamp") {
        if (item.size >= options.maxFileSize) {
          this.sizeError1 = true;
          this.uploadError1 = false;
        } else {
          this.uploadError1 = true;
          this.sizeError1 = false;
        }
      }
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      console.log("object");

      let obj = JSON.parse(response);

      this.uploadError = false;
      this.sizeError = false;
      this.uploads = [];
      this.detailsForm.markAsDirty();
      this.activestate = true;
      this.uploads.push(obj.result.data);
    };
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (!this.categoryData) {
      this.categoryData = this.categoryDt;
    }
    this.noProducts = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.productType != undefined)
      if (!_.isEmpty(this.productType)) {
        if (this.productType.hasOwnProperty("flag")) {
          this.addProducts = "Add Product";
          this.noProducts = true;
          this.deleteHide = true;
          this.selectedProducts = {};
        } else {
          this.deleteHide = false;
          this.addProducts = "Update Product";
          if (!this.productType.id) {
            this.addProducts = "Add Product";
          }
          this.selectedProducts = _.cloneDeep(this.productType);
          this.submitProduct = false;
        }
      } else {
        this.pointerEvent = false;

        this.newProduct(true);
      }
  }

  ngOnInit() {
    this.categoryData = this.categoryDt;
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
  newProduct(flag: boolean): void {
    this.inputEl.nativeElement.focus();
    if (flag) this.detailsForm.reset();
    this.selectedProducts = {};
    this.deleteHide = true;
    this.productType = {};
    this.fetchingData = false;
  }
  cancel(form: any): void {
    this.selectedProducts = _.cloneDeep(this.productType);
    this.detailsForm.markAsPristine();
    this.activeState = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 1000);
  }
  inputEnter($event): void {
    this.detailsForm.markAsDirty();
  }

  updateDefaultPrice(event) {
    if (!this.isEditMode) {
      this.selectedProducts.priceRange.map((obj) => {
        obj.range_price = event.target.value;
      });
    } else {
      this.productType.priceRange.map((obj, i) => {
        if (obj.range_price == "0") {
          this.selectedProducts.priceRange[i].range_price = event.target.value;
        } else {
        }
      });
    }
  }
  public totalSpinner: boolean;

  createProductType(form: any): void {
    this.conformsubmit = true;
    this.totalSpinner = false;
    if (form.value.price == "0") {
    }
    let toast: object;
    this.submitProduct = true;
    let param: any = {
      form_data: form.value.storeCustomAttributes[0],
      id: this.selectedProducts.id || "",
      moduleName: this.moduleName
    };
    let productIds = [];
    param.priceRange = [];
    this.utilsService.saveStoreAttribute(param).then((res) => {
      this.conformsubmit = false;
      this.totalSpinner = false;
      if (res.success) {
        toast = {
          msg: res.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.trigger.emit({ flag: param.id, data: param.id ? this.selectedProducts :res.data.new_data});
      } else {
        toast = {
          msg: res.message ? res.message : "Failed to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  setParameter(name) {
    this.fileNameType = name;
  }
  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }
  fileDrop(event): void {}
  deleteImage(index: number): void {
    this.activestate = true;
    this.resetUploaderConfig();

    this.uploads.splice(index, 1);
    const deletedFileIndex = this.uploader.queue.findIndex(
      (item) => item._file.name === this.uploader.queue[index]._file.name
    );
    if (deletedFileIndex !== -1) {
      this.uploader.queue.splice(deletedFileIndex, 1);
    }
    this.detailsForm.markAsDirty();
  }
  resetUploaderConfig(): void {
    this.uploader.options.additionalParameter = {
      type: "", // Reset the type parameter
    };
  }
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
    this.activeState = true;
    if(this.isEditPerm) {
      this.detailsForm.enable();
      } else {
        this.detailsForm.disable();
      }
  }
  emitUploadInfo(ev) {
    this.moduleName = ev.module;
    this.uploads = ev.uploadList || [];
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
    this.activeState = true;
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
        id: this.selectedProducts.id,
      },
    });
  }
}
