import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

import { AdminService } from "../../services/admin.service";
import { PostInvoice } from "../../orders-module/post-invoice/postInvoice.component";

@Component({
  selector: "app-create-einvoice",
  templateUrl: "./create-einvoice.component.html",
  styleUrls: ["./create-einvoice.component.scss"],
})
export class CreateEinvoiceComponent implements OnInit {
  server_error: string;
  loginDetails: any = {};
  public is_captcha_enabled: boolean = false;
  submitDisabled: boolean = false;
  private cookie: any = {};
  public name: any = {};
  genEinvLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PostInvoice>,
    public adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  public order_id;

  ngOnInit(): void {}

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }

  onConfirm(): void {
    this.dialogRef.close({ success: true });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
