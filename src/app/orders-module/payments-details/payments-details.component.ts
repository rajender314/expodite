import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Images } from "../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { SnakbarService } from "../../services/snakbar.service";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-payments-details",
  templateUrl: "./payments-details.component.html",
  styleUrls: ["./payments-details.component.scss"],
})
export class PaymentsDetailsComponent implements OnInit {
  @Input() invId;
  @Input() invoiceData;
  @Input() orderId;
  @Input() ordersInfo: any;
  @Input() shipmentID;
  @Output() updateInv = new EventEmitter();
  @Input() viewActivityLogIcon;
  public images = Images;
  public newColumnAdded;

  constructor(public dialog: MatDialog, private snackbar: SnakbarService, public adminService: AdminService) {}
  public overpadiAmount: number = 0;
  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    console.log(this.adminService.rolePermissions.edit_shipment)
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.overpadiAmount =
      this.invoiceData?.commercial_invoice[0].amount_overpaid;
  }
  triggerGridEvent(event) {
    this.updateInv.emit({
      id: this.invId,
      type: "commercial_invoice_details",
    });
  }

  paidInvoice(data?: any) {
    let dialogRef = this.dialog.open(MarkAsPaidComponent, {
      width: "700px",
      data: {
        orders_id: this.orderId || "",
        invoice_id: this.invId,
        invoiceData: this.invoiceData,
        currency:
          this.ordersInfo.selectedOrder?.create_shipment[0]?.currency_type,
        balance_amount: this.invoiceData?.commercial_invoice[0]?.balance_amount,
        rowData: data?.node.data || "",
        shipment_id: this.shipmentID,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        console.log(result.message);
        // this.getPaymentInfo();

        this.newColumnAdded = true;
        this.updateInv.emit({
          id: this.invId,
          type: "commercial_invoice_details",
        });
        setTimeout(() => {
          this.newColumnAdded = false;
        }, 1000);
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
        id: this.orderId,
      },
    });
  }
}
