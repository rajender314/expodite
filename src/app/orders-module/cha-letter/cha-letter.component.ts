import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Images } from "../../images/images.module";
import moment = require("moment");
import { E } from "@angular/cdk/keycodes";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";

@Component({
  selector: "cha-letter",
  templateUrl: "./cha-letter.component.html",
  styleUrls: ["./cha-letter.component.scss"],
})
export class CHALetterComponent implements OnInit {
  @Output() getSiDraft = new EventEmitter<void>();
  @Input() clientPermission;
  @Input() orderId: string;
  @Input() orders;
  @Input() freightData;
  @Input() transport_name;
  @Input() data;
  @Input() viewActivityLogIcon;

  public currentDate = moment(new Date()).format("DD-MM-YYYY");
  public isEditing = false;

  public images = Images;
  public toAddress = "";
  public cha_declaration = "";
  public products;
  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cha_declaration = this.data?.cha_declaration
      ? this.cha_declaration
      : "Please declare commission 12.50% in shipping bill payable to agent in foreign country.";
    if (this.data?.product) {
      this.products = this.data?.product?.replace(/\n/g, "<br>");
    }
  }
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
      if (!this.data?.cha_declaration) {
        // If it's empty or undefined, assign the default message to `this.cha_declaration`
        this.cha_declaration =
          "Please declare commission 12.50% in shipping bill payable to agent in foreign country.";
      } else {
        // If it's not empty, assign its value to `this.cha_declaration`
        this.cha_declaration = this.data.cha_declaration;
      }
    } else {
      this.getSiDraft.emit();
      this.isEditing = false;
    }
  }
  async onEdited() {
    this.toAddress = this.toAddress?.replace(/\n/g, "<br>");
    console.log(this.toAddress, 456);
    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "CHA_LETTER",

      context: {
        toAddress: this.toAddress,
        cha_declaration: this.cha_declaration,
        product: this.data.product,
      },
    });
    if (response.result.success) {
      this.products = response?.result?.data?.context.product?.replace(
        /\n/g,
        "<br>"
      );
      this.data = response.result.data.context;
      let toast: object;
      toast = {
        msg: "Cha Letter Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      let toast: object;
      toast = {
        msg: "Cha Letter Update Failed",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.isEditing = false;
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

  typeOfContainersString(): string {
    return this.freightData.containers
      .filter((container) => container.type_of_container) // Filter out containers without type_of_container
      .map((container) => container.type_of_container) // Map to type_of_container values
      .join(", ");
  }
}
