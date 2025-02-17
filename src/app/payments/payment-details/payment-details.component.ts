import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LeadsService } from "../../leads/leads.service";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { OrdersService } from "../../services/orders.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { Images } from "../../images/images.module";
import { FormArray, FormGroup } from "@angular/forms";
import { language } from "../../language/language.module";
import { AdminService } from "../../services/admin.service";

declare var App: any;
@Component({
  selector: "app-payment-details",
  templateUrl: "./payment-details.component.html",
  styleUrls: ["./payment-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("ordersAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class PaymentDetailsComponent implements OnInit {
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  data = {
    estimate_id: "",
    search: this.params.search,
    pageSize: this.params.pageSize,
    page: this.params.page,
  };
  public images = Images;
  public language = language;
  public showSavePanel = false;
  public EditIcon: string =
    App.public_url + "signatures/assets/images/edit_1.png";
  public disableBtn = false;
  public editForm: FormGroup;
  public moduleName = "";
  public selectedClientDetail = [];
  status: any;
  status_slug: string;
  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    private snackbar: SnakbarService,
    private leadService: LeadsService,
    public adminService: AdminService
  ) {}
  public fetchingData: boolean = true;
  public selectedInsuranceList = [];
  public isLoading = true;
  public PolicyNumber: string;

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.activatedRoute.params.subscribe(
      (param) => (this.data.estimate_id = param.id)
    );
    this.titleService.setTitle(App["company_data"].insuranceTitle);
    this.getViewDetails(this.data.estimate_id, "payment_details");
  }
  navigateToShipment(orderId: number, shipmentId: number, invoiceNo: string) {
    this.router.navigate(["/orders", orderId, "shipments", shipmentId], {
      state: { source: "payments" },
    });
  }
  getViewDetails(id, type: string, update?: boolean) {
    if (!update) {
      this.fetchingData = true;
    }
    this.OrdersService.getViewDetails({ id, type }).then((response) => {
      if (response.result.data && response.result.success) {
        this.selectedInsuranceList = response.result.data.add_payments;
        this.status =
          response.result?.data?.add_payments?.[0]?.status?.trim() || "";
        this.status_slug =
          response.result?.data?.add_payments?.[0]?.status_slug?.trim() || "";
        this.PolicyNumber = response.result.data.add_payments[0].payment_id;
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
    this.fetchingData = false;
  }
  public currentTabIndex = 0;
  public editable: boolean;

  onTabChange(index: number) {
    this.currentTabIndex = index;
    if (this.currentTabIndex == 1) {
      this.getPaymentUsedDetails();
    }
  }
  goBack() {
    this.router.navigate(["/payments"]);
  }
  editInventory(): void {
    if (!this.editable) {
      this.editable = true;
      this.triggerConversionRateLogic();
    }
  }
  triggerConversionRateLogic(): void {
    setTimeout(() => {
      const storeCustomAttributesArray = this.editForm.get(
        "storeCustomAttributes"
      ) as FormArray;

      if (storeCustomAttributesArray && storeCustomAttributesArray.at(0)) {
        const firstAttributeGroup = storeCustomAttributesArray.at(
          0
        ) as FormGroup;

        // Subscribe to valueChanges of the entire FormGroup at index 0
        firstAttributeGroup.valueChanges.subscribe((formValue) => {
          if (formValue.amount_received_inr && formValue.amount_received) {
            const conversionRate =
              parseFloat(formValue.amount_received_inr) /
              parseFloat(formValue.amount_received);

            // Update the 'conversion_rate_applied' control
            firstAttributeGroup.patchValue(
              { conversion_rate_applied: conversionRate.toFixed(2) }, // Round to 2 decimal places
              { emitEvent: false } // Prevent triggering `valueChanges` again
            );
          }
        });
      }
    }, 3000); // 3 seconds delay
  }
  resetInsurance(form: any) {
    this.editInventory();
    this.editable = false;
    this.showSavePanel = false;
  }

  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.editForm = ev.form;
    if (this.editForm.dirty) {
      this.showSavePanel = true;
    }
  }
  public uploads = [];
  emitUploadInfo(ev) {
    console.log(ev);
    this.showSavePanel = true;

    this.moduleName = ev.module;
    this.uploads = ev.uploadList;
    this.editForm = ev.form;
    if (this.uploads.length) {
      this.editForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue(this.uploads);
    } else {
      this.editForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue([]);
    }
  }
  update() {
    this.disableBtn = true;
    let toast: object;
    let param: any = {
      form_data: this.editForm.value.storeCustomAttributes[0],
      id: this.data.estimate_id,
      moduleName: this.moduleName,
    };
    if (!this.editForm.valid) return;
    this.utilsService.saveStoreAttribute(param).then((res) => {
      this.disableBtn = false;
      if (res.success) {
        this.showSavePanel = false;
        this.editable = false;
        this.getViewDetails(this.data.estimate_id, "payment_details");
        toast = { msg: "Payment Updated Successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  getPaymentUsedDetails() {
    const params = {
      name: "payment_used_details",
      selectedNumber: this.data.estimate_id,
    };
    this.leadService.getGridList(params).then((response) => {
      if (response.result.success) {
        const res = response.result.data;
        this.selectedClientDetail = res.total_data;
      }
    });
  }
  downloadFile(file, i, flag) {
    window.open(file.filepath, "_blank");
  }
}
