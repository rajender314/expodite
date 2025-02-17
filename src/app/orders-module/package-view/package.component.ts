import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { Images } from "../../images/images.module";
import { AddPackageComponent } from "../../dialogs/add-package/add-package.component";
import { SnakbarService } from "../../services/snakbar.service";
import { FormBuilder } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { OrdersService } from "../../services/orders.service";
import { Title } from "@angular/platform-browser";
import { ProductsImportComponent } from "../../estimates-module/products-import/products-import.component";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";

declare var App: any;

@Component({
  selector: "app-package",
  templateUrl: "./package.component.html",
  styleUrls: ["./package.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PackageComponent implements OnInit {
  @Output() getSiDraft = new EventEmitter<void>();
  @Output() dataEvent = new EventEmitter<string>();
  @Input() viewActivityLogIcon;
  public images = Images;
  public newItemIcon: string =
    App.base_url + "dashboard/assets/images/new-plus.png";
  public packageDescription;
  public editDescription;
  public productsData;
  public showPackage: boolean = true;
  public showAddpackage: boolean = true;
  printPackage: boolean;
  public summaryPackage;
  @Input() data: any;
  @Input() trigger: any;
  public productsCount = new Map();
  @Input() orderedProducts: any;
  public disableAddPackage: boolean = true;

  caluculateTotaladded() {
    this.productsCount = new Map();
    this.productsData.some((box) => {
      box.products.some((item) => {
        if (this.productsCount.has(item.id)) {
          this.productsCount.set(
            item.id,
            this.productsCount.get(item.id) + item.quantity
          );
        } else {
          this.productsCount.set(item.id, item.quantity);
        }
      });
    });
    this.onDisableAddPackage();
  }

  onDisableAddPackage() {
    this.disableAddPackage = this.orderedProducts?.some((item) => {
      if (
        this.productsCount.has(item.order_product_id) &&
        this.productsCount.get(item.order_product_id) !==
          parseFloat(item.product_quantity)
      )
        return true;
      else if (!this.productsCount.has(item.order_product_id)) return true;
      else return false;
    });
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
  }

  ngOnInit(): void {
    this.getPackagingDetailsApi();
  }
  ngOnChanges(): void {
    if (this.data) {
      this.getPackagingDetailsApi();
    } else {
      this.getPackagingDetailsApi();
    }
  }
  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private cookie: CookieService,
    private router: Router
  ) {}
  getPackagingDetailsApi(): void {
    this.OrdersService.getProductPackageApi({ orders_id: this.data.id }).then(
      (response) => {
        if (response.result.success) {
          this.productsData = response.result.data?.packages;
          this.dataEvent.emit({ ...response.result.data, flag: true });
          this.summaryPackage = response.result.data?.summary;
          this.packageDescription =
            response.result.data?.summary?.description.replace(/\n/g, "<br>");
          if (this.productsData?.length) {
            this.caluculateTotaladded();
            this.showAddpackage = false;
            this.showDrumsList = false;
          }
        }
      }
    );
  }
  public packing_id;
  showDrumsList;
  addPackage(product, flag?) {
    // If flag is 'edit', find the packing_id from productsData
    if (flag === "edit") {
      let packing_id = 0;
      const foundProduct = this.productsData.find(
        (value) => value.packing_id === product.id
      );
      if (foundProduct) {
        packing_id = foundProduct.packing_id;
      }
      this.packing_id = packing_id;
    }

    // Open dialog
    const dialogRef = this.dialog.open(AddPackageComponent, {
      panelClass: "alert-dialog",
      width: "800px",
      data: {
        disableAddPackage: this.disableAddPackage,
        flag: flag,
        orders_id: this.data.id,
        container: this.productsData,
        packing_id: product,
        productsCount: this.productsCount,
      },
      disableClose: true,
    });

    // Subscribe to dialog close event
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        // Call API to get packaging details
        this.getPackagingDetailsApi();
        // Hide drums list
        this.showDrumsList = false;
        // Emit event with updated data
        this.dataEvent.emit({
          ...result.result.result.data,
          durm: this.showDrumsList,
          flag: false,
        });
      }
    });
  }

  public showPackageSavePanel = false;

  cancelPackageDescription() {
    this.getPackagingDetailsApi();
    this.showPackageSavePanel = false;
    this.editDescription = false;
  }
  editPackageDescription() {
    let param = {
      id: this.data.id,
      description: this.packageDescription,
    };
    this.OrdersService.updateOrdersPackage(param).then((response) => {
      if (response.result.success) {
        this.packageDescription = this.packageDescription.replace(
          /\n/g,
          "<br>"
        );

        let toast: object;
        toast = {
          msg: "Package details updated successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.showPackageSavePanel = false;
        this.editDescription = false;
        this.getSiDraft.emit();
      } else {
        let toast: object;
        toast = { msg: "Failed To Update", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  descriptionEdit() {
    this.editDescription = true;
    this.packageDescription = this.packageDescription.replace(/<br>/gi, "\n");
  }
  addBatchNumber() {}
  togglePackage() {
    this.showPackage = !this.showPackage;
    this.printPackage = !this.printPackage;
  }
  valChanged(event) {
    this.showPackageSavePanel = true;
    this.packageDescription = event.target.value;
  }
  uploadLineItemDocPackage() {
    // if (this.inClient) {
    // this.isAddProduct = false;
    let dialogRef = this.dialog.open(ProductsImportComponent, {
      width: "550px",
      data: {
        type: "packingList",
        clickedFrom: "packing_list",
        orders_id: this.data.id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.dataEvent.emit({
          ...result.data,
          durm: this.showDrumsList,
          flag: false,
        });
        this.getPackagingDetailsApi();
      }
    });
    // } else {

    // }
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
        type: type,
        orders_id: this.data.id,
      },
    });
  }
}
