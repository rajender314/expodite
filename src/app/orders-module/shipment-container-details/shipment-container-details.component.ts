import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Images } from "../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { OrdersService } from "../../services/orders.service";
import { CreateContainerComponent } from "./create-container/create-container.component";
import { AdminService } from "../../services/admin.service";
@Component({
  selector: "app-shipment-container-details",
  templateUrl: "./shipment-container-details.component.html",
  styleUrls: ["./shipment-container-details.component.scss"],
})
export class ShipmentContainerDetailsComponent implements OnInit {
  @Input() shipmentId: String;
  @Input() orders: String;
  @Input() enableAddContainer: boolean = false;
  @Output() getUnassignedPackages = new EventEmitter();
  public selectdRows: Boolean = false;
  public images = Images;
  public selectPallet: Boolean = false;
  public containersData;
  public newPalletAdded = false;
  public newContainerAdded = false;
  public newPackageAdded = false;
  constructor(public dialog: MatDialog, private ordersService: OrdersService,public adminService: AdminService,) {}

  ngOnInit(): void {}
  getContainersData(data) {
    this.containersData = data;
  }
  addContainer(contData?) {
    console.log(contData);
    let dialogRef = this.dialog.open(CreateContainerComponent, {
      panelClass: "alert-dialog",
      width: "900px",
      data: {
        title: contData ? "Edit Container" : "Add Container",
        saveApi: "",
        tableName: "create_container",
        related_to_id: this.shipmentId,
        orders: this.orders,
        rowData: contData?.rowData ? contData.rowData : {},
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.success) {
        this.newContainerAdded = true;
        this.getUnassignedPackages.emit();
        setTimeout(() => {
          this.newContainerAdded = false;
        }, 100);
      }
    });
  }
}
