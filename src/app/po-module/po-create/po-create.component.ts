import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { trigger, style, transition, animate } from "@angular/animations";
import { UtilsService } from "../../services/utils.service";
import { SnakbarService } from "../../services/snakbar.service";
import { LeadsService } from "../../leads/leads.service";
import * as _ from "lodash";
declare var App: any;

const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-po-create",
  templateUrl: "./po-create.component.html",
  styleUrls: ["./po-create.component.scss"],
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
export class POCreateComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<POCreateComponent>,
    private snackbar: SnakbarService,
    private utilsService: UtilsService,
    private service: LeadsService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  public estimate_form_id = "";
  public poFormData: any;
  public selectedCurrency = "";
  public moduleName = "";
  formEmitEvent(ev) {
    // console.log(ev);
    this.moduleName = ev.module;
    this.poFormData = ev.form;
    this.estimate_form_id = ev.estimate_form_id;
    this.clientSelectedId =
      this.poFormData.value.storeCustomAttributes[0].vendor_id;
    const currency =
      this.poFormData &&
      this.poFormData.controls.storeCustomAttributes["controls"][0].get(
        "currency_id"
      ).value;
    const indx = _.findIndex(this.currencyList, { id: currency.id });
    if (indx > -1) {
      this.selectedCurrency = this.currencyList[indx];
    }
  }
  public productsFormData: any;
  public currencyList = [];
  public clientSelectedId;
  public clientId;
  emitNewProductsData(ev) {
    // console.log(ev);
    this.productsFormData = ev.addProdustsForm;
    this.subTotalVal = ev.subTotalVal;
  }
  public SubTotalPayload: any = "";
  subTotalFormEvent(ev) {
    this.SubTotalPayload = ev.form;
  }

  changeclietId(ev) {
    this.currencyList = ev.dependentDropdowns.currency_id;
    this.clientSelectedId = ev.clientId;
    this.clientId = ev.clientId;
  }

  async getDropdownsList(module) {
    await this.service
      .getDropdowns({
        module: "add_po",
        form_control_name: "",
        search: "",
      })
      .then(async (response) => {
        if (response.result.success) {
          this.totalClients = response.result.data.vendor_id;
        }
      });
  }
  public totalClients = [];
  public subTotalVal = 0;

  public disabledSave = false;
  async createPoConfirm(): Promise<void> {
    if (
      !this.SubTotalPayload.valid ||
      !this.poFormData.valid ||
      !this.productsFormData.valid
    ) {
      this.SubTotalPayload.markAllAsTouched();
      this.poFormData.markAllAsTouched();
      this.productsFormData.markAllAsTouched();
      return;
    }
    this.disabledSave = true;
    let param: any;
    param = {
      add_po: this.poFormData.value.storeCustomAttributes[0],
      po_subtotal_form: this.SubTotalPayload.value.fieldList[0],
    };
    const mod = this.moduleName;
    if (this.data.order_id && !this.data.isEditMode) {
      param.add_products_in_po = this.productsFormData.value.productItem
        .filter((item) => item.is_checked)
        .map(({ is_checked, ...rest }) => rest);
    } else param.add_products_in_po = this.productsFormData.value.productItem;
    await this.getDropdownsList(mod);
    if (this.totalClients.length) {
      const indx = _.findIndex(this.totalClients, {
        label: param.add_po.vendor_id,
      });
      if (indx > -1) {
        param.add_po.vendor_id = this.totalClients[indx].id;
      }
    }
    this.productsApi(param);
  }

  getSelectedProdsLenght() {
    if (this.data.order_id && !this.data.isEditMode) {
      return (
        this.productsFormData?.value?.productItem
          .filter((item) => item.is_checked)
          .map(({ is_checked, ...rest }) => rest).length || 0
      );
    } else {
      return 1;
    }
  }
  public fetchingData = false;
  public productsApi(data) {
    let toast: object;
    this.SubTotalPayload.disable();
    this.poFormData.disable();
    this.productsFormData.disable();
    const apiToCall = this.data.isEditMode
      ? this.service.saveAttributes
      : this.service.createPO;
    const params = {
      // related_to_id: this.data.estimate_id,
      related_to_id: this.data.order_id,
      form_id: this.estimate_form_id,
      meta_data: {
        // add_product: this.pfiProductsPayload.value.productItem,
        ...data,
      },
      id: this.data.isEditMode ? this.data.order_id : "",
      moduleName: this.moduleName,
    };

    apiToCall.call(this.service, params).then((response) => {
      this.fetchingData = false;
      if (response.result.success) {
        // localStorage.clear();
        localStorage.removeItem("customFields");
        localStorage.removeItem("moduleName");
        // toast = {
        //   msg: response.result.message,
        //   status: "success",
        // };
        // this.snackbar.showSnackBar(toast);

        this.dialogRef.close({
          success: true,
          response: response.result.data.new_data
            ? response.result.data.new_data.id
            : "",
        });
        // this.dialogRef.close();
      } else {
        this.SubTotalPayload.enable();
        this.poFormData.enable();
        this.productsFormData.enable();
        this.disabledSave = false;
        toast = {
          msg: response.result.message
            ? response.result.message
            : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
