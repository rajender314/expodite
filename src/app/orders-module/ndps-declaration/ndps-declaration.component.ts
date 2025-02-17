import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "ndps-declaration",
  templateUrl: "./ndps-declaration.component.html",
  styleUrls: ["./ndps-declaration.component.scss"],
})
export class NdpsDeclarationComponent implements OnInit {
  @Input() orders;
  @Input() compnayDetails;
  @Input() clientPermission;
  @Input() data;
  // @Input() productDetails;
  public showNdpsDecl: boolean = true;
  public isEditing = false;
  public images = Images;
  public productDetails;
  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.productDetails = this.data?.product;
    }, 1000);
  }
  toggleNDPSDecl() {
    this.showNdpsDecl = !this.showNdpsDecl;
  }
  onEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
    } else {
      this.isEditing = false;
      this.productDetails = this.data?.product;
    }
  }
  async onEdited() {
    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "NDPS_DECLARATION",

      context: { product: this.productDetails },
    });
    if (response.result.success) {
      this.data = response.result.data.context;
      let toast: object;
      toast = {
        msg: "NDPS Declaration Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      let toast: object;
      toast = {
        msg: "NDPS Declaration Update Failed",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.isEditing = false;
  }
}
