import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { OrdersService } from '../../services/orders.service';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-mark-as-paid',
  templateUrl: './mark-as-paid.component.html',
  styleUrls: ['./mark-as-paid.component.scss']
})
export class MarkAsPaidComponent implements OnInit {
	added:boolean;
  constructor(public dialog: MatDialog,
	// private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<any>,
  ) {dialogRef.disableClose = true; }

	ngOnInit() {
	}
	markAsPaid() {
		this.dialogRef.close({success:true});
	}
}
