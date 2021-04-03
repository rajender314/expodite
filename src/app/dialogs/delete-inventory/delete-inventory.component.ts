import { InventoryDetailsComponent } from './../../inventory-module/inventory/inventory-details/inventory-details.component';
import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { language } from '../../language/language.module';

@Component({
  selector: 'app-delete-inventory',
  templateUrl: './delete-inventory.component.html',
  styleUrls: ['./delete-inventory.component.scss'],
  providers: [InventoryService]
})
export class DeleteInventoryComponent implements OnInit {
  public language = language;
  constructor(public dialog: MatDialog,
              private InventoryService: InventoryService,
              public dialogRef: MatDialogRef<InventoryDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
            ) {dialogRef.disableClose = true; }
 

  ngOnInit() {
    //  console.log(this.data)
  }
   deleteInventory(): void {
    this.InventoryService
    .deleteBatch({id:this.data.id})
    .then(response => {
      if(response.result.success) {
        this.dialogRef.close({success: true, id: this.data.id})
      }
    });
  }
}
