import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDatepicker } from "@angular/material/datepicker";
import moment = require("moment");
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";

@Component({
  selector: "si-draft",
  templateUrl: "./si-draft.component.html",
  styleUrls: ["./si-draft.component.scss"],
})
export class SiDraftComponent implements OnInit {
  @Input() siData: any;
  @Input() orderData: any;
  @Input() orderId: any;
  @Input() compnayDetails: any;
  @Input() portOfDischarge: string;
  @Input() specialInstructions: string;
  @Input() selectedOrderStatus: string;
  @Input() viewActivityLogIcon;
  public editModeSIDraft = false;
  public images = Images;
  public export_ref = "";
  public notify = "";
  public marks_and_nos = "";
  public decription_of_goods = "";
  public no_of_packages = "";
  bol_date: any = "";
  remarks = "";
  no_of_bls = "";
  private dummySidata;

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bol_date = this.siData.bol_date
      ? moment(this.siData.bol_date).format("YYYY-MM-DD")
      : "";
  }
  formatMomentDate(date: any): string {
    return moment(date).format("YYYY-MM-DD");
  }
  showDiv: boolean = true;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  editSIDraft() {
    if (!this.editModeSIDraft) {
      this.dummySidata = { ...this.siData };
      this.bol_date = this.siData.bol_date
        ? moment(this.siData.bol_date).format("YYYY-MM-DD")
        : "";

      this.editModeSIDraft = true;
      if (this.siData) {
        if (this.siData.export_ref)
          this.export_ref = this.siData.export_ref?.replace(/<br>/gi, "\n");
        else this.export_ref = "";
        if (this.siData.notify)
          this.notify = this.siData.notify?.replace(/<br>/gi, "\n");
        else this.notify = "";
        if (this.siData.marks_and_nos)
          this.marks_and_nos = this.siData.marks_and_nos?.replace(
            /<br>/gi,
            "\n"
          );
        else this.marks_and_nos = "";
        if (this.siData.decription_of_goods)
          this.decription_of_goods = this.siData.decription_of_goods?.replace(
            /<br>/gi,
            "\n"
          );
        else this.decription_of_goods = "";
        if (this.siData.no_of_packages)
          this.no_of_packages = this.siData.no_of_packages?.replace(
            /<br>/gi,
            "\n"
          );
        else this.no_of_packages = "";
        if (this.siData.remarks)
          this.remarks = this.siData.remarks?.replace(/<br>/gi, "\n");
        else this.remarks = "";
        if (this.siData.no_of_bls)
          this.no_of_bls = this.siData.no_of_bls?.replace(/<br>/gi, "\n");
        else this.no_of_bls = "";
      }
    } else {
      this.editModeSIDraft = false;
      this.siData = { ...this.dummySidata };
      this.bol_date = this.siData.bol_date
        ? moment(this.siData.bol_date).format("YYYY-MM-DD")
        : "";
    }
  }

  openCalendar(picker: MatDatepicker<Date>) {
    this.editModeSIDraft && picker.open();
  }

  async saveSiDraft() {
    this.notify = this.notify?.replace(/\n/g, "<br>");

    this.export_ref = this.export_ref?.replace(/\n/g, "<br>");
    this.marks_and_nos = this.marks_and_nos?.replace(/\n/g, "<br>");
    this.decription_of_goods = this.decription_of_goods?.replace(/\n/g, "<br>");
    this.no_of_packages = this.no_of_packages?.replace(/\n/g, "<br>");
    this.remarks = this.remarks?.replace(/\n/g, "<br>");
    this.no_of_bls = this.no_of_bls?.replace(/\n/g, "<br>");

    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orderId,
      type: "SHIPPING_INSTRUCTION_DRAFT",
      context: {
        ...this.siData,
        notify: this.notify,
        export_ref: this.export_ref,
        marks_and_nos: this.marks_and_nos,
        decription_of_goods: this.decription_of_goods,
        no_of_packages: this.no_of_packages,
        bol_date: this.bol_date
          ? moment(this.bol_date).format("YYYY-MM-DD")
          : "",
        remarks: this.remarks,
        no_of_bls: this.no_of_bls,
      },
    });
    if (response.result.success) {
      this.editModeSIDraft = false;
      this.siData = response.result.data.context;
      this.dummySidata = response.result.data.context;
      let toast: object;
      toast = {
        msg: "Shipping Instructions Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      this.editModeSIDraft = false;

      let toast: object;
      toast = {
        msg: "Shipping Instructions Update Failed",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    }
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
        orders_id: this.orderId,
      },
    });
  }
  onContentChanged = (event) => {};
  onFocus = () => {};
  onBlur = () => {};
  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };
}
