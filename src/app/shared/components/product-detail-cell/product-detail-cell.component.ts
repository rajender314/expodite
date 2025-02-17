import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ICellRendererAngularComp } from "ag-grid-angular";
import {
  IAfterGuiAttachedParams,
  ICellRendererParams,
} from "ag-grid-community";
import { SplitEstimateComponent } from "../../../dialogs/split-estimate/split-estimate.component";
import { Lightbox } from "ngx-lightbox";
import { PdfPreviewComponent } from "../../../dialogs/pdf-preview/pdf-preview.component";
declare var App: any;
@Component({
  selector: "app-product-detail-cell",
  templateUrl: "./product-detail-cell.component.html",
  styleUrls: ["./product-detail-cell.component.scss"],
})
export class ProductDetailCellComponent implements ICellRendererAngularComp {
  public params: any;
  public noProductImg: string =
    App.public_url + "signatures/assets/images/no_product.png";
  public showSplitBtn = false;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  agInit(props: ICellRendererParams): void {
    this.params = props;
    // console.log(this.params)
    if (this.params.customParams.tableName != "poInvoice" && this.params.customParams.tableName != "newCommercialInvoice") {
      if (
        (this.params.customParams.orders.selectedOrder.status_id == "3" ||
          this.params.customParams.orders.selectedOrder.status_id == "5" ||
          this.params.customParams.orders.selectedOrder.status_id == "6") &&
        !this.params?.data?.is_po_created &&
        !this.params?.data?.is_order_created &&
        !this.params.customParams.isCheckBoxColumn
      ) {
        this.showSplitBtn = true;
      } else {
        this.showSplitBtn = false;
      }
    }
  }
  constructor(public dialog: MatDialog, private _lightbox: Lightbox) {}
  refresh(params: any): boolean {
    // console.log(params)
    this.params = params;
    if (this.params.customParams.enableSplit) {
      this.showSplitBtn = true;
    } else {
      this.showSplitBtn = false;
    }
    return true;
  }

  ngOnInit(): void {}
  splitQty() {
    let dialogRef = this.dialog.open(SplitEstimateComponent, {
      panelClass: "alert-dialog",
      width: "300px",
      data: {
        quantity: this.params.data.product_quantity.toString(),
        estimate_id: this.params.data.estimate_id,
        order_product_id: this.params.data.estimate_product_id,
      },
      // data: newObject,

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.params.context.componentParent.onCustomCellClick({
      //   data: this.params.data,
      //   colId: this.params.column.colId
      // });
      if (result) {
        this.params.context.componentParent.onCustomCellClick(result);
      }
    });
  }
  onChange(event: any) {
    const checked = event.target.checked;
    console.log(this.params);
    if (checked) {
      this.params.node.setSelected(checked); // This updates the row selection in Ag-Grid
    }
    this.params.node.setDataValue(this.params.colDef.field, checked); // This updates the cell value
  }

  openPreview(file, i: number, flag): void {
    if (flag === "product_image") {
      let imgObj = {
        src: file,
        thumb: "name",
      };
      this._lightbox.open([{ ...imgObj }], 0);
    } else if (
      file.link_url.lastIndexOf(".pdf") == -1 &&
      file.link_url.lastIndexOf(".doc") == -1 &&
      file.link_url.lastIndexOf(".docx") == -1 &&
      file.link_url.lastIndexOf(".xlsx") == -1
    ) {
      if (flag == "origin") {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      } else if (flag == "insurance") {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      } else if (flag == "shipping") {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      } else if (flag == "estimates") {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      } else if (flag == "sales") {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      } else {
        this._lightbox.open(this.params.customParams.originFileAttachments, i);
      }
    } else {
      let dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: "850px",
        data: file,
      });
    }
  }
}
