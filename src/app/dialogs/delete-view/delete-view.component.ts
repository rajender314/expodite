import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { OrdersDuebyClientsComponent } from '../../reports/orders-dueby-clients/orders-dueby-clients.component';

@Component({
  selector: 'app-delete-view',
  templateUrl: './delete-view.component.html',
  styleUrls: ['./delete-view.component.css']
})
export class DeleteViewComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  // deleteView() {
  //   // this.dialogRef.close({success: true})
  // }
}
