import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { language } from '../../language/language.module';
import { UserDetailsComponent } from '../../users/user-details/user-details.component';

declare var App: any
@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {

 
  apiCall: string;
  success: boolean;
  private language = language;
  constructor(
    public http: HttpClient,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {dialogRef.disableClose = true;
    this.apiCall = App.base_url + data.url;
  }

  ngOnInit() {
  }


  confirm(): void {
    this.success = true;
    this.dialogRef.close({success: true})
  }
}
