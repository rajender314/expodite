import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OrdersService } from "../../../services/orders.service";
import { SnakbarService } from "../../../services/snakbar.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { LeadsService } from "../../../leads/leads.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "create-package",
  templateUrl: "./create-package.component.html",
  styleUrls: ["./create-package.component.scss"],
})
export class CreatePackageComponent implements OnInit {
  // public language = language;
  public productsForm: FormGroup;
  public packageForm: FormGroup;
  public packageTotalsForm: FormGroup;
  public is_pallet;
  public metaData;
  public netWtSubPackage = 0;
  public grossWtSubPackage = 0;
  public totalNetWeight = 0;
  public totalGrossWeight = 0;
  public packageQuantity = 0;
  constructor(
    public dialogRef: MatDialogRef<CreatePackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService,
    private service: LeadsService,
    private sanitizer: DomSanitizer
  ) {}

  public productRemainQty: any = {};
  ngOnInit(): void {
    this.getShipmentProducts();
  }

  handleRemainingQtytError() {
    return this.productsForm?.value?.productItem.some((item) => {
      if (item.name.id) {
        return (
          item.quantity *
            this.packageQuantity *
            (this.is_pallet ? item.number_of_sub_packages : 1) >
          this.productRemainQty[item.name.id].remaining_quantity
        );
      } else {
        false;
      }
    });
  }
  async getShipmentProducts() {
    await this.service
      .getShipmentProducts({
        shipment_id: this.data.related_to_id,
        packing_id: this.data.prefillId ? this.data.prefillId : "",
      })
      .then((res) => {
        this.productRemainQty = res.result.data;
      });
  }
  public resetProductsForm = false;
  setResetProductsForm() {
    this.resetProductsForm = true;
    setTimeout(() => (this.resetProductsForm = false), 1000);
  }
  public PackingLabel: string;
  public startingLabel = 0;
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;

    if (ev.module === "new_create_package") {
      this.packageForm = ev.form;
      const customAttributes =
        this.packageForm?.value?.storeCustomAttributes[0];

      if (customAttributes) {
        let { is_pallet, tare_weight, name } = customAttributes;
        if (!tare_weight) {
          tare_weight = 0;
        }
        const { quantity } = this.packageTotalsForm?.value
          ?.storeCustomAttributes[0]
          ? this.packageTotalsForm?.value?.storeCustomAttributes[0]
          : { quantity: 0 };
        this.PackingLabel = is_pallet ? "Pallet" : name;
        this.packageQuantity = quantity ? +quantity : 0;
        this.is_pallet = !!is_pallet;
        const netWeightMultiplier = Number(quantity);

        if (ev?.onInputChange)
          this.updateSubPackageWeights(
            tare_weight || 0,
            netWeightMultiplier || 0
          );
      } else {
        this.is_pallet = !!this.is_pallet;
      }
    } else if (ev.module === "package_totals") {
      this.packageTotalsForm = ev.form;
      // debugger;
      const customAttributes =
        this.packageForm?.value?.storeCustomAttributes[0];

      if (customAttributes) {
        const { is_pallet, tare_weight, name } = customAttributes;

        const {
          quantity,
          net_weight_of_package,
          net_weight_per_pallet,
          gross_weight_of_package,
          gross_weight_per_pallet,
        } = this.packageTotalsForm?.value?.storeCustomAttributes[0]
          ? this.packageTotalsForm?.value?.storeCustomAttributes[0]
          : {
              quantity: 0,
              net_weight_of_package: 1,
              net_weight_per_pallet: 1,
              gross_weight_of_package: 1,
              gross_weight_per_pallet: 1,
            };
        this.PackingLabel = is_pallet ? "Pallet" : name;
        this.packageQuantity = quantity ? +quantity : 0;
        this.is_pallet = !!is_pallet;
        const netWeightMultiplier = Number(quantity);

        if (ev?.onInputChange)
          this.updateSubPackageWeights(
            tare_weight || 0,
            netWeightMultiplier || 0,
            net_weight_per_pallet || net_weight_of_package,
            gross_weight_per_pallet || gross_weight_of_package
          );
      } else {
        this.is_pallet = !!this.is_pallet;
      }

      if (this.packageTotalsForm)
        this.startingLabel =
          +this.packageTotalsForm?.value?.storeCustomAttributes[0]
            ?.starting_label_no;
    } else {
      this.productsForm = ev.addProdustsForm;
      const customAttributes =
        this.packageForm?.value?.storeCustomAttributes[0];

      if (customAttributes) {
        this.productsRemainAndTotalQty();

        const { tare_weight } = customAttributes;
        const quantity =
          this.packageTotalsForm?.value?.storeCustomAttributes[0].quantity;

        // console.log(starting_label_no, customAttributes, 65);
        if (ev?.onInputChange) this.resetSubPackageWeights();
        const products = ev?.addProdustsForm?.value?.productItem;

        if (products && ev?.onInputChange) {
          const netWeightMultiplier =
            // this.is_pallet
            //   ? number_of_pallets
            //   :
            quantity;

          this.calculateProductWeights(
            products,
            tare_weight || 0,
            netWeightMultiplier || 0
          );
        }
      }
    }
  }

  resetSubPackageWeights() {
    this.netWtSubPackage = 0;
    this.grossWtSubPackage = 0;
    this.totalNetWeight = 0;
    this.totalGrossWeight = 0;
  }

  updateSubPackageWeights(tare_weight, multiplier, net_weight?, gross_weight?) {
    let grossWeight;
    if (this.is_pallet) {
      this.resetSubPackageWeights();
      this.grossWtSubPackage = 0;
      const customAttributes =
        this.packageForm?.value?.storeCustomAttributes[0];

      if (customAttributes) {
        const { tare_weight, quantity } = customAttributes;
        const products = this.productsForm?.value?.productItem;

        if (products) {
          const netWeightMultiplier = quantity;

          this.calculateProductWeights(
            products,
            tare_weight || 0,
            netWeightMultiplier || 0
          );
        }
      }
      grossWeight = gross_weight ? gross_weight : this.grossWtSubPackage;
    } else {
      grossWeight = gross_weight
        ? gross_weight
        : this.netWtSubPackage + Number(tare_weight);
    }
    let netWeight = net_weight ? net_weight : this.netWtSubPackage;
    this.totalNetWeight = netWeight * multiplier;
    this.totalGrossWeight = grossWeight * multiplier;

    this.metaData = {
      netWtSubPackage: netWeight,
      grossWtSubPackage: grossWeight,
      totalNetWeight: this.totalNetWeight,
      totalGrossWeight: this.totalGrossWeight,
    };
  }

  calculateProductWeights(products, tare_weight, multiplier) {
    products.forEach((obj: any) => {
      if (this.is_pallet) {
        if (obj.total_net_weight) {
          this.netWtSubPackage += Number(obj.total_net_weight) || 0;
          this.grossWtSubPackage += Number(obj.total_net_weight) || 0;
        } else {
          this.netWtSubPackage +=
            Number(obj.net_weight) * (obj.number_of_sub_packages || 0);
          this.grossWtSubPackage +=
            Number(obj.gross_weight) *
            (parseFloat(obj.number_of_sub_packages) || 0);
        }
      } else {
        this.netWtSubPackage += Number(obj.unit_weight) * (obj.quantity || 0);
      }
    });

    if (isNaN(this.netWtSubPackage)) this.netWtSubPackage = 0;
    if (isNaN(this.grossWtSubPackage)) this.grossWtSubPackage = 0;
    this.grossWtSubPackage =
      (this.is_pallet ? this.grossWtSubPackage : this.netWtSubPackage) +
      Number(tare_weight);
    this.totalNetWeight = Number(this.netWtSubPackage) * multiplier;
    this.totalGrossWeight = this.grossWtSubPackage * multiplier;
    this.metaData = {
      netWtSubPackage: this.netWtSubPackage,
      grossWtSubPackage: this.grossWtSubPackage,
      totalNetWeight: this.totalNetWeight,
      totalGrossWeight: this.totalGrossWeight,
    };
  }

  emitUploadInfo(ev) {}
  public disabledSave = false;
  editProducts() {
    if (!this.packageForm.valid || !this.productsForm.valid) {
      this.packageForm.markAllAsTouched();
      this.productsForm.markAllAsTouched();
      return;
    }

    let param = {
      id: this.data.prefillId ? this.data.prefillId : "",
      related_to_id: this.data.related_to_id || "",
      meta_data: {
        new_create_package: {
          ...this.packageForm.value.storeCustomAttributes[0],
          is_pallet: this.is_pallet,
        },
        add_product_in_package: this.productsForm.value.productItem,
        package_totals: this.packageTotalsForm.value.storeCustomAttributes[0],
      },
      moduleName: this.moduleName,
    };
    let toast: object;
    this.disabledSave = true;
    // return;
    this.ordersService.createPackage(param).then((res) => {
      if (res.result.success) {
        toast = { msg: res.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        // this.trigger.closed = true;
        this.dialogRef.close({ success: true });
      } else {
        this.disabledSave = false;
        toast = {
          msg: res.result.message ? res.result.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  generatePackingLabels() {
    const endLabel = this.startingLabel + this.packageQuantity - 1;
    return `${this.PackingLabel} ${this.startingLabel} - ${this.PackingLabel} ${endLabel}`;
  }
  // public productsData;
  // getProductsData(event: any) {
  //   this.productsData = event.products.name;
  //   console.log(event);
  // }
  productsRemainAndTotalQty() {
    let str = "";
    if (this.productsForm?.value) {
      this.productsForm.value.productItem.some((item) => {
        if (item?.name?.id) {
          const usedQty =
            this.productRemainQty[item.name.id].total_quantity -
            this.productRemainQty[item.name.id].remaining_quantity +
            item.quantity *
              this.packageQuantity *
              (this.is_pallet ? item.number_of_sub_packages : 1);

          // let value = `${
          //   this.productRemainQty[item.name]?.product_name || "name"
          // } : Quantity Added : ${usedQty} | Total Quantity : ${
          //   this.productRemainQty[item.name].total_quantity
          // }`;

          let value =
            this.productRemainQty[item.name.id].total_quantity == usedQty
              ? `<div style="padding-bottom: 4px;"><b>${
                  this.productRemainQty[item.name.id]?.product_name || "name"
                }</b>: Quantity Added: ${usedQty} <b>|</b> <span *ngIf=" this.productRemainQty[item.name.id].total_quantity == usedQty" style="color: green;">Total Quantity: ${
                  this.productRemainQty[item.name.id].total_quantity
                }</span><br></div>`
              : `<div style="padding-bottom: 4px;"><b>${
                  this.productRemainQty[item.name.id]?.product_name || "name"
                }</b>: Quantity Added: ${usedQty} <b>|</b> <span *ngIf=" this.productRemainQty[item.name.id].total_quantity == usedQty" style="color: red;">Total Quantity: ${
                  this.productRemainQty[item.name.id].total_quantity
                }</span><br></div>`;
          str += value;
        }
      });
    }
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
}
