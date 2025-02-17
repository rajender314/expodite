import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';

@Component({
  selector: 'app-delete-upload',
  templateUrl: './delete-upload.component.html',
  styleUrls: ['./delete-upload.component.scss']
})
export class DeleteUploadComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  deleteUpload() {
    this.dialogRef.close({success: true})
  }
}
