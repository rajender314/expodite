import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { Lightbox } from "ngx-lightbox";
declare var App: any;

@Component({
  selector: "app-editicon-cell",
  templateUrl: "./editicon-cell.component.html",
  styleUrls: ["./editicon-cell.component.scss"],
})
export class EditiconCellComponent implements ICellRendererAngularComp {
  public params: any;
  public noProductImg: string =
    App.public_url + "signatures/assets/images/no_product.png";
  public showEditIcon = false;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";

  agInit(props: ICellRendererParams): void {
    // console.log(props);
    this.params = props;
    if (
      this.params.customParams.tableName != "poInvoice" &&
      this.params.customParams.orders
    ) {
      if (
        this.params.customParams.orders.selectedOrder.status_id != "4" &&
        !this.params.customParams.orders.selectPO &&
        !this.params.customParams.orders.selectOrder &&
        !this.params?.data?.is_order_created
      ) {
        this.showEditIcon = true;
      } else {
        this.showEditIcon = false;
      }
    } else if (this.params.customParams.tableName == "poInvoice") {
      this.showEditIcon = true;
    } else if (
      this.params.customParams.tableName == "freight_container_details" ||
      this.params.customParams.tableName == "payments"
    ) {
      this.showEditIcon = true;
    }
  }
  constructor(public dialog: MatDialog, private _lightbox: Lightbox) {}
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}
