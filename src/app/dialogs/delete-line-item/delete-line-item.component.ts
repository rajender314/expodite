import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';

@Component({
  selector: 'app-delete-line-item',
  templateUrl: './delete-line-item.component.html',
  styleUrls: ['./delete-line-item.component.scss']
})
export class DeleteLineItemComponent implements OnInit {

  public language = language;
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {dialogRef.disableClose = true; }

  ngOnInit() {
  }

  deleteLineItem(): void {
    this.dialogRef.close({success: true})
  }

}
