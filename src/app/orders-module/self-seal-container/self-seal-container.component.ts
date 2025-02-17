import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import moment = require("moment");
import { Images } from "../../images/images.module";

@Component({
  selector: "self-seal-container",
  templateUrl: "./self-seal-container.component.html",
  styleUrls: ["./self-seal-container.component.scss"],
})
export class SelfSealContainerComponent implements OnInit {
  @Output() getSiDraft = new EventEmitter<void>();

  @Input() clientPermission;
  @Input() orderId: string;
  @Input() orders;
  @Input() freightData;
  @Input() data;
  @Input() compnayDetails;

  public currentDate = moment(new Date()).format("YYYY-MM-DD");
  showSealedContainer: boolean = true;
  public images = Images;
  public isEditing = false;
  public factoryAddress = "";
  description = "";

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.data?.factoryAddress) {
      this.factoryAddress = this.data?.factoryAddress?.replace(/\n/g, "<br>");
    }
    if (this.data?.description) {
      this.description = this.data?.description?.replace(/\n/g, "<br>");
    }
  }
  onEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
      // if (this.data?.factoryAddress) {
      //   this.factoryAddress = this.data.factoryAddress?.replace(/<br>/gi, "\n");
      // }
    } else {
      this.getSiDraft.emit();
      this.isEditing = false;
    }
  }
  toggleSealedContainer() {
    this.showSealedContainer = !this.showSealedContainer;
  }
  async onEdited() {
    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "SELF_SEALED_CONTAINER",

      context: this.data,
    });
    if (response.result.success) {
      this.data = response.result.data.context;
      this.factoryAddress =
        response?.result?.data?.context.factoryAddress?.replace(/\n/g, "<br>");
      this.description = response?.result?.data.context.description?.replace(
        /\n/g,
        "<br>"
      );
      let toast: object;
      toast = {
        msg: "Self Sealed Container Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      let toast: object;
      toast = {
        msg: "Self Sealed Container Update Failed",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.isEditing = false;
  }
  valueupdate(key, index, event) {
    this.data.container[index][key] = event.target.value;
  }
}
