import { Component, Inject, OnInit } from "@angular/core";
import { OrdersService } from "../../services/orders.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-payment-details",
  templateUrl: "./payment-details.component.html",
  styleUrls: ["./payment-details.component.scss"],
  providers: [OrdersService],
})
export class PaymentDetailsDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PaymentDetailsDialog>,
    private snackbar: SnakbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService,
    private OrdersService: OrdersService
  ) {
    dialogRef.disableClose = true;
  }

  fetchingData = false;
  public selectedInsuranceList = [];
  ngOnInit(): void {
    this.getViewDetails(this.data.id, "payment_details");
  }

  getViewDetails(id, type: string, update?: boolean) {
    if (!update) {
      this.fetchingData = true;
    }
    this.OrdersService.getViewDetails({ id, type }).then((response) => {
      if (response.result.data && response.result.success) {
        this.selectedInsuranceList = response.result.data.add_payments;
        // this.status =
        //   response.result?.data?.add_payments?.[0]?.status?.trim() || "";
        // this.PolicyNumber = response.result.data.add_payments[0].payment_id;
      }
    });
    this.fetchingData = false;
  }
}
