import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import moment = require("moment");
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "scomat-declaration",
  templateUrl: "./scomat-declaration.component.html",
  styleUrls: ["./scomat-declaration.component.scss"],
})
export class ScomatDeclarationComponent implements OnInit {
  @Output() getSiDraft = new EventEmitter<void>();
  @Input() orders;
  @Input() compnayDetails;
  @Input() clientPermission;
  @Input() data;
  @Input() viewActivityLogIcon;
  @Input() productDetails;
  @Input() scomatData;
  public currentDate = moment(new Date()).format("YYYY-MM-DD");
  public images = Images;
  public isEditing = false;
  public toAddress = "";
  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  showDiv: boolean = true;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }
  onEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      if (this.data?.toAddress) {
        this.toAddress = this.data.toAddress?.replace(/<br>/gi, "\n");
      } else {
        this.toAddress = "";
      }
    } else {
      this.getSiDraft.emit();
      this.isEditing = false;
      this.productDetails = this.data?.product;
    }
  }
  async onEdited() {
    this.toAddress = this.toAddress?.replace(/\n/g, "<br>");
    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "SCOMET",

      context: {
        toAddress: this.toAddress,
        product: this.productDetails,
      },
    });
    if (response.result.success) {
      this.data = response.result.data.context;
      let toast: object;
      toast = {
        msg: "Scomet Declartion Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.isEditing = false;
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.productDetails = this.data?.product;
    }, 1000);
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
        orders_id: this.orders.selectedOrder.id,
      },
    });
  }
}
