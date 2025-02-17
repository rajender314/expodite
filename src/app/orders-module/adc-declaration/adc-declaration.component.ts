import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "adc-declaration",
  templateUrl: "./adc-declaration.component.html",
  styleUrls: ["./adc-declaration.component.scss"],
})
export class AdcDeclarationComponent implements OnInit {
  @Input() orders;
  @Input() compnayDetails;
  @Input() clientPermission;
  @Input() data;
  // @Input() productDetails;
  @Input() freightData;
  productDetails;
  shownadcdecl: boolean = true;
  public isEditing = false;
  public images = Images;
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
  toggleAdcdecl() {
    this.shownadcdecl = !this.shownadcdecl;
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
      type: "ADC_DECLARATION",
      context: { product: this.productDetails },
    });
    if (response.result.success) {
      this.data = response.result.data.context;
      let toast: object;
      toast = {
        msg: "ADC Declaration Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      let toast: object;
      toast = {
        msg: "ADC Declaration Update Failed",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.isEditing = false;
  }
}
