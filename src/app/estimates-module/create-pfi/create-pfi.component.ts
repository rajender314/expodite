import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
} from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormGroup } from "@angular/forms";
import * as _ from "lodash";
import { LeadsService } from "../../leads/leads.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { language } from "../../language/language.module";
declare var App: any;

const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-create-pfi",
  templateUrl: "./create-pfi.component.html",
  styleUrls: ["./create-pfi.component.scss"],
})
export class CreatePfiComponent implements OnInit {
  @HostListener("window:scroll", ["$event"])
  @Output()
  changeProducts = new EventEmitter<any>();
  public language = language;
  public estimateslanguage = estimate_name;
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  totalCount: any;
  totalClients: any;
  clientsStatus: any;
  totalPages: number;
  fetchingData = false;
  clientSelectedId: any;
  showError: boolean;
  selectAuto: boolean;
  addNew: boolean;
  errormessage: string;
  confirmButtonText: string;
  billingAddressDetails: any;
  notifyAddressDetails: any;
  inClient: boolean;
  isAddProduct: boolean;
  productsForm: FormGroup;
  public productItem: FormArray;
  discountPercent: any;
  freightamt: any;
  insuranceValue: any;
  formData: FormGroup;
  public pfiClientPayload: any = {};
  public pfiProductsPayload: any = {};
  public pfiSubTotalPayload: any = {};
  public pfiAddressPayload: any;
  public paymentForm: any = {};
  public specificationForm: any = {};
  public tabIndex = 0;
  public isDiableItems = true;
  public isDisableBtn = true;
  public closeBtnLabel = "Close";
  public disableBtn = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<CreatePfiComponent>,
    private service: LeadsService
  ) {}

  ngOnInit(): void {
    this.onTabChange(0);
  }
  moveToNextTab(tabGroup: MatTabGroup): void {
    if (tabGroup.selectedIndex < tabGroup._tabs.length - 1) {
      tabGroup.selectedIndex += 1;
      this.onTabChange(tabGroup.selectedIndex);
    } else {
      // When the last tab is reached
      this.onTabChange(tabGroup.selectedIndex + 1); // Handle the case for the last tab
    }
  }

  getSelectedAddress(obj: any) {
    this.pfiAddressPayload = {
      ...obj,
    };
    this.isDisableBtn = false;
    if (this.formData) {
      if (this.formData.valid) {
        this.isDiableItems = false;
      } else {
        this.isDiableItems = true;
      }
    }
  }
  getClientID(e) {
    const indx = _.findIndex(e.options, {
      name: this.formData.controls.storeCustomAttributes.value[0]
        .organization_id,
    });
    if (indx > -1) {
      this.formData.controls.storeCustomAttributes.value[0].organization_id =
        e.options[indx].id;
    }
  }
  public estimate_form_id = "";
  formEmitEvent(obj: any) {
    this.estimate_form_id = obj.estimate_form_id;
    this.isDisableBtn = false;
    this.formData = obj.form;
    this.moduleName = obj.module;
    obj.existingAttributesData.map((obj: any) => {
      if (obj.form_control_name == "organization_id") {
        this.getClientID(obj);
      }
    });
    this.pfiClientPayload = {
      ...obj.form,
    };

    if (this.formData.valid) {
      this.isDiableItems = false;
    } else {
      this.isDiableItems = true;
    }
  }
  public moduleName = ""
  paymentformEmitEvent(obj) {
    this.moduleName = obj.module;
    this.paymentForm = obj.form;
  }
  public subTotalVal = 0;
  productFormEmit(obj: any) {
    this.moduleName = obj.module;
    this.productsForm = obj.form;
  }

  public productFormID = "";
  emitNewProductsData(obj: any) {
    this.pfiProductsPayload = obj.addProdustsForm;
    this.productFormID = obj.productFormID;
    this.subTotalVal = obj.subTotalVal;
  }
  specificationsformEmitEvent(obj) {
    this.moduleName = obj.module;
    this.specificationForm = obj.form;
  }
  subTotalFormEvent(obj) {
    this.pfiSubTotalPayload = obj.form;
  }
  public currentTabIndex = 0;
  onTabChange(index: number) {
    this.currentTabIndex = index;
    this.closeBtnLabel = this.currentTabIndex === 0 ? "Close" : "Back";
    this.tabIndex = index;
    if (index == 0) {
      this.btnLabel = "Next";
    } else {
      const currency =
        this.formData &&
        this.formData.controls.storeCustomAttributes["controls"][0].get(
          "currency_id"
        ).value;
      const indx = _.findIndex(this.currencyList, { id: currency.id });
      if (indx > -1) {
        this.selectedCurrency = this.currencyList[indx];
      }
    }

    if (index == 3) {
      this.btnLabel = "Submit";
    } else {
      this.btnLabel = "Next";
    }
    if (index == 3) {
      this.formData.markAllAsTouched();
      this.paymentForm.markAllAsTouched();
      this.pfiProductsPayload.markAllAsTouched();
      this.pfiSubTotalPayload.markAllAsTouched();
    }
  }
  public btnLabel = "Next";
  public returnedPFID = "";
  getTabIndex(tabGroup: MatTabGroup, tabIndex) {
    if (tabIndex == 0) {
      if (this.formData.valid && this.pfiAddressPayload) {
        this.moveToNextTab(tabGroup);
      } else {
        this.formData.markAllAsTouched();
      }
    } else if (tabIndex == 1) {
      if (this.paymentForm.valid) {
        this.moveToNextTab(tabGroup);
      } else {
        this.paymentForm.markAllAsTouched();
      }
    } else if (tabIndex == 2) {
      if (this.pfiProductsPayload.valid && this.pfiSubTotalPayload.valid) {
        this.moveToNextTab(tabGroup);
      } else {
        this.pfiProductsPayload.markAllAsTouched();
        this.pfiSubTotalPayload.markAllAsTouched();
      }
    } else if (tabIndex == 3) {
      if (this.specificationForm.valid) {
        // do nothing
      } else {
        this.specificationForm.markAllAsTouched();
      }
    }
  }
  public submiteBtnClicked = false;
  tabRedirection(tabGroup: MatTabGroup, tabIndex) {
    // console.log(this.pfiAddressPayload);
    // console.log(tabGroup);
    if (tabIndex == "3") {
      if (
        !this.formData.valid ||
        !this.pfiAddressPayload ||
        (this.pfiAddressPayload &&
          !this.pfiAddressPayload.billing_address_id) ||
        (this.pfiAddressPayload && !this.pfiAddressPayload.notify_address_id) ||
        (this.pfiAddressPayload && !this.pfiAddressPayload.shipping_address_id)
      ) {
        tabGroup.selectedIndex = 0;
        this.formData.markAllAsTouched();
        this.paymentForm.markAllAsTouched();
        this.pfiProductsPayload.markAllAsTouched();
        this.pfiSubTotalPayload.markAllAsTouched();
        let scrollTag;

        setTimeout(() => {
          if (!this.formData.valid) {
            if (this.formData.controls.storeCustomAttributes) {
              const obj =
                this.formData.controls.storeCustomAttributes["controls"][0]
                  .controls;
              const names = Object.keys(obj);
              for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                  const index = names.indexOf(key);
                  if (obj[key].status == "INVALID") {
                    scrollTag = document.querySelector(
                      `.estimate-error .custom-class-${index}`
                    );
                    if (scrollTag) {
                      scrollTag.scrollIntoView({ behavior: "smooth" });
                    }
                    return;
                  }
                }
              }
            }
          } else if (
            !this.pfiAddressPayload ||
            (this.pfiAddressPayload &&
              !this.pfiAddressPayload.billing_address_id) ||
            (this.pfiAddressPayload &&
              !this.pfiAddressPayload.notify_address_id) ||
            (this.pfiAddressPayload &&
              !this.pfiAddressPayload.shipping_address_id)
          ) {
            scrollTag = document.querySelector(".select-address-error");
          }
          if (scrollTag) {
            scrollTag.scrollIntoView({ behavior: "smooth" });
          }
        }, 1000);
      } else if (!this.paymentForm.valid) {
        tabGroup.selectedIndex = 2;
        this.paymentForm.markAllAsTouched();
        this.pfiProductsPayload.markAllAsTouched();
        this.pfiSubTotalPayload.markAllAsTouched();
      } else if (
        !this.pfiProductsPayload.valid ||
        !this.pfiSubTotalPayload.valid
      ) {
        tabGroup.selectedIndex = 1;
        this.pfiProductsPayload.markAllAsTouched();
        this.pfiSubTotalPayload.markAllAsTouched();

        let scrollTag;

        setTimeout(() => {
          if (!this.pfiProductsPayload.valid) {
            const productItems = this.pfiProductsPayload.get(
              "productItem"
            ) as FormArray;
            for (let i = 0; i < productItems.controls.length; i++) {
              const formGroup = productItems.at(i) as FormGroup;
              if (formGroup.invalid) {
                scrollTag = document.querySelector(
                  `.product-error .prod-list-${i}`
                );
                if (scrollTag) {
                  scrollTag.scrollIntoView({ behavior: "smooth" });
                }
                return i; // Return the index of the first failed row
              }
            }
          } else if (!this.pfiSubTotalPayload.valid) {
            scrollTag = document.querySelector(".subtotal-error");
            if (scrollTag) {
              scrollTag.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 1000);
      } else {
        return true;
      }
    }
    setTimeout(() => {
      this.submiteBtnClicked = false;
    }, 10);
  }
  async savePfi(tabGroup: MatTabGroup, tabIndex) {
    this.submiteBtnClicked = true;
    if (tabIndex == 0 || tabIndex == 1 || tabIndex == 2) {
      this.moveToNextTab(tabGroup);
    }
    const data = this.tabRedirection(tabGroup, tabIndex);
    if (!data) {
      return;
    }
    let param: any;
    if (
      this.pfiSubTotalPayload.value &&
      this.pfiClientPayload.value &&
      this.pfiProductsPayload &&
      this.pfiProductsPayload.value &&
      this.btnLabel === "Submit"
    ) {
      param = {
        subtotal_form: this.pfiSubTotalPayload.value.fieldList[0],
        create_estimate: this.pfiClientPayload.value.storeCustomAttributes[0],
        pfi_address_form: this.pfiAddressPayload,
        add_product_in_create: this.pfiProductsPayload.value.productItem,
        add_payment_terms: this.paymentForm.value.storeCustomAttributes[0],
        pfi_other_specifications:
          this.specificationForm.value.storeCustomAttributes[0],
      };
      // return;
      const mod = localStorage.getItem("moduleName");
      this.fetchingData = true;
      this.disableBtn = true;
      await this.getDropdownsList(mod);
      if (this.totalClients.length) {
        const indx = _.findIndex(this.totalClients, {
          label: param.create_estimate.organization_id,
        });
        if (indx > -1) {
          param.create_estimate.organization_id = this.totalClients[indx].id;
        }
      }
      if (tabIndex != 0 && tabIndex != 1 && tabIndex != 2) {
        this.productsApi(param);
      }
    }
  }
  async getDropdownsList(module) {
    await this.service
      .getDropdowns({
        module: "create_estimate",
        form_control_name: "",
        search: "",
      })
      .then(async (response) => {
        if (response.result.success) {
          this.totalClients = response.result.data.organization_id;
        } else {
          this.fetchingData = false;
          this.disableBtn = false;
        }
      });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }

  public productsApi(data) {
    this.specificationForm.disable();
    let toast: object;
    const params = {
      related_to_id: this.returnedPFID,
      form_id: this.estimate_form_id,
      meta_data: {
        // add_product: this.pfiProductsPayload.value.productItem,
        ...data,
      },
      id: this.data.title == "Edit" ? this.data.estimate_id : "",
      moduleName: this.moduleName
    };
    this.service.saveAttributes(params).then((response) => {
      if (response.result.success) {
        localStorage.removeItem("customFields");
        localStorage.removeItem("moduleName");
        this.dialogRef.close({
          success: true,
          response: response.result.data.new_data
            ? response.result.data.new_data.id
            : "",
        });
      } else {
        this.specificationForm.enable();
        this.submiteBtnClicked = false;
        this.fetchingData = false;
        this.disableBtn = false;
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

  public selectedCurrency = "";
  public currencyList = [];
  public clientId = "";
  public returnedDynmicDropdowns: any = [];
  changeclietId(ev) {
    this.clientId = ev.clientId;
    this.clientSelectedId = ev.clientId;
    this.returnedDynmicDropdowns = ev;
    this.currencyList = ev.dependentDropdowns?.currency_id;
  }
  onClose(tabGroup: MatTabGroup, tabIndex) {
    tabGroup.selectedIndex -= 1;
    if (this.tabIndex === 0) {
      this.dialogRef.close();
    }
  }
}
