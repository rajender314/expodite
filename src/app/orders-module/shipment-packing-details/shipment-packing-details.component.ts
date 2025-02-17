import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Images } from "../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import { AgProductEditComponent } from "../../shared/components/ag-product-edit/ag-product-edit.component";
import { CreatePackageComponent } from "./create-package/create-package.component";
import { OrdersService } from "../../services/orders.service";
import { ProductsImportComponent } from "../../estimates-module/products-import/products-import.component";
import { ConfirmDeleteComponent } from "../../shared/components/confirm-delete/confirm-delete.component";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { AdminService } from "../../services/admin.service";
declare var App: any;
@Component({
  selector: "app-shipment-packing-details",
  templateUrl: "./shipment-packing-details.component.html",
  styleUrls: ["./shipment-packing-details.component.scss"],
})
export class ShipmentPackingDetailsComponent implements OnInit {
  @Input() shipmentId: String;
  @Input() order_Permissions: any;
  @Input() orders: String;
  @Output() packageLength = new EventEmitter();
  @Output() orderPermissions = new EventEmitter();
  @Output() updateInv = new EventEmitter();

  @Input() viewActivityLogIcon;
  public selectdRows: Boolean = false;
  public images = Images;
  public selectPallet: Boolean = false;
  public containersData;
  public newPalletAdded = false;
  public newContainerAdded = false;
  public newPackageAdded = false;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  public PrintIcon: string =
    App.public_url + "signatures/assets/images/printer-tool.svg";
  constructor(public dialog: MatDialog, private ordersService: OrdersService, public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.getPackagesApi();
  }

  addPackage(event?: any) {
    let dialogRef = this.dialog.open(CreatePackageComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        title: event?.id ? "Edit Package" : "Add Package",
        saveApi: "",
        tableName: "new_create_package",
        related_to_id: this.shipmentId,
        prefillId: event?.id ? event.id : "",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getPackagesApi();
        this.newPackageAdded = true;
        setTimeout(() => {
          this.newPackageAdded = false;
          this.orderPermissions.emit();
        }, 100);
        this.updateInv.emit({ type: "customs_invoice" });
      }
    });
  }
  assignContainer() {
    this.selectPallet = true;
    this.selectdRows = true;
  }
  cancelAssignContainer() {
    this.selectPallet = false;
  }

  openAssignContainer() {
    let dialogRef = this.dialog.open(AgProductEditComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        title: "Assign Container",
        saveApi: "",
        tableName: "assign_container",
        related_to_id: this.shipmentId,
        containersData: this.containersData,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
      }
    });
  }

  public packageTable;
  public isOpenFormat = false;
  public cbm_label;
  public declarations: any = {};
  getPackagesApi() {
    this.ordersService.getPackages(this.shipmentId).then((response: any) => {
      if (response.result.success) {
        this.declarations = !Array.isArray(response.result.data.declarations)
          ? response.result.data.declarations || {}
          : {};
        if (response.result.data.is_open_format) {
          this.isOpenFormat = true;
          this.packageTable = response.result.data.row_data;
          this.packageLength.emit({
            length: this.packageTable.length,
            isOpenFormat: this.isOpenFormat,
          });
        } else {
          this.cbm_label = response.result?.data?.packages[0]?.cbm_info;
          this.isOpenFormat = false;
          this.packageTable = response.result.data;
          this.packageLength.emit({
            length: this.packageTable.packages.length,
            isOpenFormat: this.isOpenFormat,
          });
        }
      }
    });
  }

  emitImportEvnt(event) {
    if (event.success) {
      this.getPackagesApi();
      this.updateInv.emit({ type: "customs_invoice" });
    }
  }
  editPackage() {
    let dialogRef = this.dialog.open(ProductsImportComponent, {
      width: "550px",
      data: {
        clickedFrom: "add_packing",
        module: "open_format_upload",
        type: "edit",
        shipmentID: this.shipmentId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.success) {
        this.getPackagesApi();
      }
    });
  }
  deletePackage() {
    let dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        title: "Delete Package",
        delete_item: "payment",
        saveApi: "",
        tableName: "open_package",
        shipmentId: this.shipmentId,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getPackagesApi();
        this.orderPermissions.emit();
      }
    });
  }

  onFooterEdit() {
    let dialogRef = this.dialog.open(AgProductEditComponent, {
      panelClass: "alert-dialog",
      width: "750px",
      data: {
        title: "Edit Summary",
        rowData: { id: this.shipmentId },
        saveApi: "",
        tableName: "packing_declarations",
        related_to_id: this.shipmentId,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getPackagesApi();
        this.newPalletAdded = true;
        setTimeout(() => {
          this.newPalletAdded = false;
        }, 100);
      }
    });
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
        id: this.shipmentId,
      },
    });
  }
}
