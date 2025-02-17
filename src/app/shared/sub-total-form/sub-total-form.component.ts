import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { LeadsService } from "../../leads/leads.service";
import { OrganizationsService } from "../../services/organizations.service";
import { SnakbarService } from "../../services/snakbar.service";
import * as _ from "lodash";
import { CustomValidation } from "../../custom-format/custom-validation";
declare var App: any;
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-sub-total-form",
  templateUrl: "./sub-total-form.component.html",
  styleUrls: ["./sub-total-form.component.scss"],
})
export class SubTotalFormComponent implements OnInit {
  subTotal;
  subTotalForm: any;
  subTotalData = [];
  public group = this.formBuilder.group({});
  @Input() module: any;
  @Input() subTotalSum = 0;
  @Input() selectedCurrency: any = "";
  @Output() trigger = new EventEmitter<any>();
  @Input() Contacts: any;
  @Input() related_to_id: any;
  @Input() getInputValidationTypes;
  @Input() disableEdit = false;

  @Input() isSubmitBtnClicked: any;
  submittedStoresAttributeForm: any = false;
  public totalSum = 0;
  constructor(
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private service: LeadsService
  ) {}

  async ngOnInit() {
    // console.log(this.module);
    // this.subTotalForm = this.formBuilder.group({
    //   freight: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
    //   insurance: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
    //   discount: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
    // });
    // this.totalSum = this.subTotalSum;
    this.subTotalForm = this.formBuilder.group({
      fieldList: this.formBuilder.array([]),
    });
    if (this.getInputValidationTypes != undefined)
      this.inputValidations = this.getInputValidationTypes;
    // await this.getValidationTypes();
    else await this.getDropdownsList();
    await this.getOrgStoreAttribute();
    this.submittedStoresAttributeForm = true;

    this.subTotalForm.valueChanges.subscribe((val) => {
      // this.storesAttributeForm.markAsDirty()
      this.submittedStoresAttributeForm = true;
      this.trigger.emit({ form: this.subTotalForm });
    });
    this.trigger.emit({ form: this.subTotalForm });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes,this.subTotalForm);
    // this.totalSum = this.subTotalSum;
    if (changes.subTotalSum) {
      this.totalSum = Number(
        (
          this.subTotalSum +
            this.insuranceValue +
            this.freightamt -
            this.discountPercent || 0
        ).toFixed(3)
      );
    }
    if (changes.isSubmitBtnClicked) {
      this.submittedStoresAttributeForm =
        changes.isSubmitBtnClicked.currentValue;
    }
    if (changes.Contacts && this.Contacts) {
      this.getAttributesPrefillData();
    }
  }

  async createAttributeControls(val?: string) {
    this.subTotalData.map((attr) => {
      let control;
      if (!attr.is_hide) {
        control = this.formBuilder.control(val ? val : "");
        this.group.addControl(attr.form_control_name, control);
      }
    });
    await this.fieldList.push(this.group);
    this.subTotalData.map(async (attr) => {
      await this.getValidation(attr);
    });
  }

  get fieldList() {
    return this.subTotalForm.get("fieldList") as FormArray;
  }
  public inputValidations = [];

  async getDropdownsList() {
    await this.service
      .getDropdowns({
        module: this.module,
        form_control_name: "",
        search: "",
      })
      .then(async (response) => {
        if (response.result.success) {
          this.dropdOptions = response.result.data;
        }
      });
  }
  async getValidationTypes() {
    await this.service.getValidationTypes().then((res) => {
      if (res.result && res.result.success) {
        this.inputValidations = res.result.data;
      }
    });
  }
  async getValidation(obj) {
    if (
      this.subTotalForm.controls.fieldList["controls"][0].get(
        obj.form_control_name
      )
    ) {
      this.subTotalForm.controls.fieldList["controls"][0]
        .get(obj.form_control_name)
        .setValidators(await this.bindValidation(obj));
    }
    this.subTotalForm.updateValueAndValidity();
    this.trigger.emit({ form: this.subTotalForm });

    return [];
  }

  getRegex(validationId) {
    const indx = _.findIndex(this.inputValidations, { id: validationId });
    if (indx > -1) {
      return this.inputValidations[indx].regex;
    }
  }
  async bindValidation(ele) {
    let list = [];
    if (ele.required) {
      list.push(Validators.required);
      // list.push(Validators.required);
      // list.push(CustomValidation.noWhitespaceValidator);
    }
    if (
      ele.slug === "single_line_text" ||
      ele.slug === "paragraph_text" ||
      ele.slug === "number"
    ) {
      list.push(CustomValidation.noWhitespaceValidator);
      if (ele.regex) {
        list.push(Validators.pattern(ele.regex));
      }
      if (ele.max_length) {
        list.push(Validators.maxLength(ele.max_length));
      }
    }
    if (ele.slug === "single_line_text" || ele.slug === "paragraph_text") {
      if (ele.min_length) {
        list.push(Validators.minLength(ele.min_length));
      }
    }

    // if (ele.validations && ele.validations.length) {
    //   if (ele.validations[0].hasOwnProperty("minLength")) {
    //     list.push(Validators.minLength(ele.validations[0].minLength));
    //   }
    //   if (ele.validations[0].hasOwnProperty("maxLength")) {
    //     list.push(Validators.maxLength(ele.validations[0].maxLength));
    //   }
    //   if (ele.validations[0].hasOwnProperty("pattern")) {
    //     list.push(Validators.pattern(ele.validations[0].pattern));
    //   }
    // }
    return list;
  }

  public prefillObject;
  public uploadObject = [];
  public form_id;
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: this.module,
        // related_to_id: this.related_to_id,
      })
      .then(async (response) => {
        if (response.result.success) {
          this.subTotalData = response.result.data.attributes.base_attributes;
          this.form_id = response.result.data.attributes.form_id;
          await this.createAttributeControls();
          if (this.Contacts) {
            await this.getAttributesPrefillData();
          }
        }
      })
      .catch((error) => console.log(error));
  }
  public dropdOptions;

  onKeyUpChange(e: any, name: any, type: string) {
    if (name == "discount") {
      if (this.subTotalForm && this.subTotalSum) {
        this.subTotalForm.controls.fieldList["controls"][0]
          .get("discount")
          .setValidators(Validators.max(this.subTotalSum));
      }
    }
  }

  currencyFormatter(number, currency) {
    const locales = this.getLocalesForCurrency(currency);

    if (locales.length > 0) {
      const locale = locales[0]; // Use the first matching locale
      const formatter = new Intl.NumberFormat(locale, {
        // style: "currency",
        // currency: currency, // uncomment for currency symbol at price
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });

      return formatter.format(number ? number : 0);
      // .replace(/[^0-9.,]/g, ""); // Remove currency symbol
    }

    return parseFloat(number ? number : 0)
      .toFixed(3)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getLocalesForCurrency(currency) {
    const currencyLocales = {
      USD: ["en-US"],
      INR: ["en-IN"],
      EUR: ["de-DE", "fr-FR", "es-ES", "it-IT"],
      GBP: ["en-GB"],
      JPY: ["ja-JP"],
      CAD: ["en-CA", "fr-CA"],
      AUD: ["en-AU"],
      CNY: ["zh-CN"],
      CHF: ["de-CH", "fr-CH", "it-CH"],
      SEK: ["sv-SE"],
      NZD: ["en-NZ"],
      MXN: ["es-MX"],
      SGD: ["en-SG", "zh-SG"],
      HKD: ["en-HK", "zh-HK"],
      NOK: ["nb-NO", "nn-NO"],
      KRW: ["ko-KR"],
      TRY: ["tr-TR"],
      RUB: ["ru-RU"],
      BRL: ["pt-BR"],
      ZAR: ["en-ZA"],
      AED: ["ar-AE"],
      SAR: ["ar-SA"],
      MYR: ["ms-MY"],
      IDR: ["id-ID"],
      THB: ["th-TH"],
      // Add more currencies and their locales as needed
    };

    return currencyLocales[currency] || [];
  }

  onInput(e, name: any) {
    if (!/^(\d+(\.\d{0,3})?)?$/.test(e.target.value)) {
      e.target.value = e.target.value.slice(0, -1);
      e.preventDefault();
    } else {
      if (name == "insurance") {
        this.insuranceValue = Number(e.target.value);
        this.totalSum = Number(
          (this.subTotalSum + this.insuranceValue + this.freightamt).toFixed(3)
        );
        this.calculateDiscount();
      } else if (name == "freight") {
        this.freightamt = Number(e.target.value);
        this.calculateFreight();
      } else if (name == "discount") {
        this.discountPercent = Number(e.target.value);
        this.discount = Number(e.target.value);
        this.calculateDiscount();
      }
    }
  }
  public freightamt = 0;
  public insuranceValue = 0;
  public discountPercent = 0;
  public discount = 0;
  calculateFreight() {
    this.totalSum = Number(
      (this.subTotalSum + this.freightamt + this.insuranceValue).toFixed(3)
    );
    this.calculateDiscount();
  }
  calculateDiscount() {
    this.totalSum = Number(this.subTotalSum.toFixed(3));
    this.totalSum = Number(
      (
        this.totalSum +
        this.freightamt +
        this.insuranceValue -
        this.discountPercent
      ).toFixed(3)
    );
  }

  async getAttributesPrefillData() {
    let data;
    await this.service
      .getAttributes({
        related_to_id: this.related_to_id || "",

        module: this.form_id,
        id: this.Contacts?.id || this.Contacts,
      })
      .then((response) => {
        if (response.result.success && response.result.data) {
          data = response.result.data[0].meta_data;
          this.subTotalForm.patchValue({
            fieldList: [data],
          });
          const fieldListControls = this.subTotalForm.get(
            "fieldList"
          ) as FormArray;
          fieldListControls.controls.forEach(
            (formGroup: FormGroup, index: number) => {
              Object.keys(formGroup.controls).forEach((key) => {
                const control = formGroup.get(key);
                const value = control.value;
                if (key === "freight") {
                  this.freightamt = parseFloat(value);
                } else if (key === "insurance") {
                  this.insuranceValue = parseFloat(value);
                } else if (key === "discount") {
                  this.discountPercent = isNaN(parseFloat(value))
                    ? 0
                    : parseFloat(value);
                }
              });
            }
          );

          this.totalSum = Number(
            (
              this.subTotalSum +
              this.insuranceValue +
              this.freightamt -
              this.discountPercent
            ).toFixed(3)
          );
        }
        return data;
      })
      .catch((error) => console.log(error));
    return data;
  }
}
