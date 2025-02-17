import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { HttpClient } from "@angular/common/http";
import { language } from "../../language/language.module";
import { UserDetailsComponent } from "../../users/user-details/user-details.component";
import { SnakbarService } from "../../services/snakbar.service";
declare var App: any;

@Component({
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styleUrls: ["./alert-dialog.component.scss"],
  providers: [SnakbarService],
})
export class AlertDialogComponent implements OnInit {
  apiCall: string;
  success: boolean;
  private language = language;
  constructor(
    public http: HttpClient,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.apiCall = App.base_url + data.url;
  }

  ngOnInit() {
    // console.log(this.data)
  }

  backendCall(param): Promise<any> {
    return this.http
      .post(this.apiCall, param)
      .toPromise()
      .then((response) => response)
      .catch((error) => console.log(error));
  }
  public fetching = false;
  confirm(): void {
    this.fetching = true;
    this.backendCall({ email: this.data.result.email })
      .then((response) => {
        if (response.result.success) {
          this.success = true;
          this.data.msg = response.result.message;
          this.data.reset_url = response.result.data.reset_password;
          let toast: object;
          toast = {
            msg: "Reset Password link sent successfully.",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);

          // setTimeout(() => {
          //   this.dialogRef.close();
          // }, 1000);
        } else {
          this.fetching = false;
          this.success = false;
        }
        this.dialogRef.close();
      })
      .catch((error) => {
        this.fetching = false;
        console.log(error);
      });
  }
}
