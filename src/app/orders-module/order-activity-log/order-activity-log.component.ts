import { animate, style, transition, trigger } from "@angular/animations";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";

@Component({
  selector: "app-order-activity-log",
  templateUrl: "./order-activity-log.component.html",
  styleUrls: ["./order-activity-log.component.scss"],
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("300ms ease-out", style({ transform: "translateX(0%)" })),
      ]),
    ]),
  ],
})
export class OrderActivityLogComponent implements OnInit {
  public fetchingData = true;
  constructor(
    private OrdersService: OrdersService,
    public dialogRef: MatDialogRef<OrderActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
  public logs = [];
  public noDataMsg = false;
  ngOnInit(): void {
    this.getActivityLog();
  }

  getActivityLog() {
    var tz_offset = new Date().getTimezoneOffset();
    let param = {
      module: this.data.module,
      id: this.data.id,
      // offset: tz_offset,
    };
    this.OrdersService.getOrderActivityLog(param).then((response) => {
      if (response.result.success) {
        this.fetchingData = false;
        this.logs = response.result.data;
        if (Object.keys(this.logs).length) {
          this.noDataMsg = false;
        } else {
          this.noDataMsg = true;
        }
      } else {
        this.fetchingData = false;
      }
    });
  }

  getType(params) {
    var type = typeof params;
    return type;
  }
}
