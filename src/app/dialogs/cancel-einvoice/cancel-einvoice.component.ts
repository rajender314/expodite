import { Component, HostListener, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PostInvoice } from './../../orders-module/post-invoice/postInvoice.component';
import { error } from "console";

interface Reasons {
  reason: string;
  value: string;
}

@Component({
  selector: 'app-cancel-einvoice',
  templateUrl: './cancel-einvoice.component.html',
  styleUrls: ['./cancel-einvoice.component.scss']
})
export class CancelEinvoiceComponent implements OnInit {

  selectedReason: any;
  cancelRemarks: any;
  reasonValue: number;
  cancelEinvLoading: boolean;
  detailsForm: FormGroup;
  showEinv: any;
  constructor(
    public dialogRef: MatDialogRef<PostInvoice>,
    public adminService: AdminService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.generateDetailsForm()
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }
  generateDetailsForm(): void {
    this.detailsForm = this.formBuilder.group({
      reasonsControl: [null, [Validators.required]],
      remarksControl:[null, [Validators.required]],

    });
  }
  // reasonsControl = new FormControl("", Validators.required);
  // remarksControl = new FormControl("", Validators.required);

  cancelReasons: Reasons[] = [
    {
      reason: "Duplicate",
      value: "1",
    },
    {
      reason: "Data Entry Mistake",
      value: "2",
    },
    {
      reason: "Order Cancelled",
      value: "3",
    },
    {
      reason: "Others",
      value: "4",
    },
  ];

  showEinvoice() {
    this.adminService
      .showEinvoice({ com_inv_id: this.data.com_inv_id })
      .then((response) => {
        if (response.result.success) {
          this.showEinv = response.result.data;
        }
      })
      .catch((error) => console.log(error));
  }

  cancelEinvoice(form ?: FormGroup) {
    this.cancelEinvLoading = true;
    if (form.valid) {
      this.selectedReason = this.detailsForm.controls.reasonsControl.value;
      this.cancelRemarks = this.detailsForm.controls.remarksControl.value;
    }
    this.adminService
      .cancelEinvoice({com_inv_id: this.data.com_inv_id, CnlRsn: this.selectedReason, CnlRem: this.cancelRemarks })
      .then((response)=>{
        if(response.result.success) {
          this.dialogRef.close({success : true, result: response});
          this.cancelEinvLoading = false;
          this.showEinvoice();
        }
      }
      )
      .catch((error)=>console.log(error));
  }
}



