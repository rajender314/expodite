import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
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
import { MatTabChangeEvent } from "@angular/material/tabs";
import { language } from "../../../language/language.module";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { OrganizationsService } from "../../../services/organizations.service";
import { Images } from "../../../images/images.module";
import { SnakbarService } from "../../../services/snakbar.service";
import { DeleteUploadComponent } from "../../../dialogs/delete-upload/delete-upload.component";
declare var App: any;
@Component({
  selector: "app-client-products",
  templateUrl: "./client-products.component.html",
  styleUrls: ["./client-products.component.scss"],
  providers: [SnakbarService],
})
export class ClientProductsComponent implements OnInit, OnChanges {
  @Input() Organization;

  public mailListArray: FormArray;
  // disabled = true;
  myProductForm2: FormGroup;
  selectedChecbox1: boolean;
  selectedChecbox2: boolean;
  checkBox2: boolean;
  checkBox1: boolean;
  myProfile: boolean;
  adminUser: boolean;
  myProductForm1: FormGroup;
  private language = language;
  public images = Images;
  public uploadData: Array<any>[];
  public uploadId: Array<any>;
  public uploadAttrId: Array<any>;
  public showUpload: boolean;
  public companyDetails: any;
  sizeError: boolean;
  uploadImage = false;

  public uploader: FileUploader = new FileUploader({
    allowedMimeType: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    private snackbar: SnakbarService
  ) {
    this.uploader.onAfterAddingFile = (item: any) => {};
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      response: any,
      options: any
    ) => {
      let toast: object;
      // this.uploadImage = true;
      if (item.size >= options.maxFileSize) {
        // console.log('largeFile')
        this.sizeError = true;
        this.uploadImage = false;
        toast = { msg: "File Size Exceeds Max Limit 5mb", status: "error" };
        this.snackbar.showSnackBar(toast);
      } else {
        this.uploadImage = true;
        this.sizeError = false;
        // console.log('file invalid')
        toast = {
          msg: "You have selected an invalid file type. Only jpg, jpeg, png and pdf files are allowed.",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      // console.log('123')
      let toast;
      toast = { msg: "TLA uploaded successfullly", status: "success" };
      this.snackbar.showSnackBar(toast);
      this.getUploadTla();
    };
    this.myProductForm1 = this.fb.group({
      products1: this.fb.array([]),
    });
    this.myProductForm2 = this.fb.group({
      products2: this.fb.array([]),
    });
    this.getCompanyDetails();
  }

  ngOnInit() {
    this.getProductList();
    this.getUploadTla();
    this.createForm();

    let profile: boolean;
    let admin_profile: boolean;
    setTimeout(() => {
      App.user_roles_permissions.map(function (val) {
        if (val.code == "client_interface") {
          if (val.selected) {
            profile = true;
          } else {
            profile = false;
          }
        }
        if (val.code == "admin") {
          if (val.selected) {
            admin_profile = true;
          } else {
            admin_profile = false;
          }
        }
      });
      this.myProfile = profile;
      this.adminUser = admin_profile;
      // console.log(this.adminUser)
    }, 1000);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.myProductForm1.reset();
    this.myProductForm2.reset();
    this.getProductList();
    this.getUploadTla();
    this.selectedChecbox1 = false;
    this.selectedChecbox2 = false;
    // this.createForm();
  }

  getCompanyDetails() {
    this.companyDetails = App["company_data"];
  }
  getUploadTla() {
    // id:response.result.data.OrgAtt.id
    this.organizationsService
      .getTLA({ orgs_id: this.Organization.id })
      .then((response) => {
        this.uploadData = response.result.data.OrgAtt;
        if (this.uploadData.length) {
          this.uploadId = response.result.data.OrgAtt[0].id;
          this.uploadAttrId = response.result.data.OrgAtt[0].att_id;
        }

        if (this.uploadData.length) {
          this.showUpload = true;
        } else {
          this.showUpload = false;
        }
      });
  }
  deleteTla() {
    this.organizationsService
      .deleteTLA({ id: this.Organization.id })
      .then((response) => {});
  }
  getProductList() {
    this.organizationsService
      .getMyProductList({ org_id: this.Organization.id })
      .then((response) => {
        const productList = [];
        const fb = this.formBuilder;
        if (response.result.success) {
          if (response.result.data.type === 0) {
            this.selectedChecbox1 = true;
            response.result.data.productValues.map(function (value, index) {
              productList.push(fb.group(value));
            });
            this.myProductForm1 = this.formBuilder.group({
              products1: this.formBuilder.array(productList),
            });
          } else if (response.result.data.type === 1) {
            this.selectedChecbox2 = true;
            response.result.data.productValues.map(function (value, index) {
              productList.push(fb.group(value));
            });
            this.myProductForm2 = this.formBuilder.group({
              products2: this.formBuilder.array(productList),
            });
          } else {
            this.selectedChecbox1 = false;
            this.selectedChecbox2 = false;
            this.myProductForm1 = this.formBuilder.group({
              products1: this.formBuilder.array([]),
            });
            this.myProductForm2 = this.formBuilder.group({
              products2: this.formBuilder.array([]),
            });
            this.addMail();
            this.addProducts();
          }
        }
        if (this.adminUser) {
          // this.selectedChecbox1 = disabled;
          // this.renderer.removeAttribute(this.elRef.nativeElement, 'disabled');
        }
      });
  }
  createForm() {
    const control = <FormArray>this.myProductForm1.controls["products1"];
    control.push(
      this.fb.group({
        product_name: [""],
        product_brand: [""],
      })
    );
    const productValue = <FormArray>this.myProductForm2.controls["products2"];
    productValue.push(
      this.fb.group({
        product_name: "",
        product_brand: "",
      })
    );
  }
  removeMail(index) {
    const control = <FormArray>this.myProductForm1.controls["products1"];
    if (this.myProductForm1.controls.products1.value.length > 1) {
      // this.myProductForm1.controls.products1.value.splice(index, 1);
      control.removeAt(index);
    }
  }
  deleteProducts(index) {
    const productValue = <FormArray>this.myProductForm2.controls["products2"];
    if (this.myProductForm2.controls.products2.value.length > 1) {
      // this.myProductForm2.controls.products2.value.splice(index, 1);
      productValue.removeAt(index);
    }
  }
  fileSelectedvalue(event): void {
    if (this.uploadData.length) {
      this.uploader.setOptions({
        url:
          App.base_url +
          "uploadTLA?orgs_id=" +
          this.Organization.id +
          "&id=" +
          this.uploadId,
      });
    } else {
      this.uploader.setOptions({
        url:
          App.base_url +
          "uploadTLA?orgs_id=" +
          this.Organization.id +
          "&id=" +
          "",
      });
    }
  }
  submitValue() {
    let toast: object;
    if (this.selectedChecbox1) {
      const products = {
        type: 0,
        org_id: this.Organization.id,
        productValues: this.myProductForm1.controls.products1.value,
      };
      this.organizationsService.addProducts(products).then((response) => {
        if (response.result.success) {
          toast = { msg: " Products saved successfully.", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      const productsList = {
        type: 1,
        org_id: this.Organization.id,
        productValues: this.myProductForm2.controls.products2.value,
      };
      this.organizationsService.addProducts(productsList).then((response) => {
        if (response.result.success) {
          toast = { msg: " Products saved successfully.", status: "success" };
          this.snackbar.showSnackBar(toast);
        }
      });
    }
  }
  addMail() {
    const control = <FormArray>this.myProductForm1.controls.products1;
    control.push(
      this.fb.group({
        product_name: [""],
        product_brand: [""],
      })
    );
  }
  addProducts() {
    const control = <FormArray>this.myProductForm2.controls.products2;
    control.push(
      this.fb.group({
        product_name: "",
        product_brand: "",
      })
    );
  }
  uploadDel(index) {
    let toast: object;
    let dialogRef = this.dialog.open(DeleteUploadComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.organizationsService
        .deluploadedTLA({ id: this.uploadId, att_id: this.uploadAttrId })
        .then((response) => {
          if (response.result.success) {
            toast = { msg: "Upload deleted successfully.", status: "success" };
            this.snackbar.showSnackBar(toast);
            this.uploadData.splice(index, 1);
          }
        });
    });
  }
}
