import { OrdersComponent } from "./../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { language } from "../../language/language.module";
import { OrdersService } from "../../services/orders.service";

@Component({
  selector: "app-delete-line-item",
  templateUrl: "./delete-line-item.component.html",
  styleUrls: ["./delete-line-item.component.scss"],
})
export class DeleteLineItemComponent implements OnInit {
  public language = language;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,

    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  deleteLineItem(): void {
    this.OrdersService.deleteFromData({
      id: this.data.lineItem.id,
      type: this.data.type,
      module_id: this.data?.module_id ? this.data.module_id : "",
    }).then((res) => {
      this.dialogRef.close({ success: true });
    });
  }
}
