import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-token-expired',
  templateUrl: './token-expired.component.html',
  styleUrls: ['./token-expired.component.scss']
})
export class TokenExpiredComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TokenExpiredComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  confirm(): void {
   
    this.dialogRef.close({success: true})
  }

}
