import { Component, OnInit ,Inject } from '@angular/core';
import {AccountsService}from '../../services/accounts.service'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { SnakbarService } from '../../services/snakbar.service';
import { HistoryEditComponent } from '../history-edit/history-edit.component';
@Component({
  selector: 'app-amount-history',
  templateUrl: './amount-history.component.html',
  styleUrls: ['./amount-history.component.scss']
})
export class AmountHistoryComponent implements OnInit {
public historyData:any
historyDatainv:any
  constructor(private AccountsService:AccountsService,public dialog: MatDialog,public dialogRef: MatDialogRef<AmountHistoryComponent>, private fb: FormBuilder,private snackbar: SnakbarService, @Inject(MAT_DIALOG_DATA) public data:MatDialog) { }

  ngOnInit(): void {
    this.getAmountsHist()
  }
  getAmountsHist():void{
		let toast: object;

    this.AccountsService
    .getAmountsHist({id:this.data['id']})
        .then(response => {
          if (response.result.success) {
          this.historyData =  response.result.data.data
          this.historyDatainv=  response.result.data.inv_nbr
        console.log(this.historyData )
        }  
        
	   })}
     historyEdit(data:any,type:any){
      let dialogRef = this.dialog.open(HistoryEditComponent, {
        panelClass: 'alert-dialog',
        width: '400px',
        data: {
          type: type,
          ...data
          }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result ) {
         	this.getAmountsHist()
        }
      });
  
    }

    close(){
      this.dialogRef.close({success: true});
    }
}

