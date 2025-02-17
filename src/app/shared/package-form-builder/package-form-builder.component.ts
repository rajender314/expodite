import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Injectable,
  EventEmitter,
  Output,
  HostListener,
} from "@angular/core";
import { LeadsService } from "../../leads/leads.service";
import {
  Validators,
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDatepicker } from "@angular/material/datepicker";
import * as _ from "lodash";
import { OrganizationsService } from "../../services/organizations.service";
import { DialogComponent } from "../../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SnakbarService } from "../../services/snakbar.service";
import { CustomValidation } from "../../custom-format/custom-validation";
import moment = require("moment");
declare var App: any;

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-package-form-builder",
  templateUrl: "./package-form-builder.component.html",
  styleUrls: ["./package-form-builder.component.scss"],
})
export class PackageFormBuilderComponent implements OnInit {
  @Input() overrideForm: boolean = false;
  @Input() isAddress: boolean = false;
  @Input() disableEdit: boolean = false;
  @Input() module: any;
  @Input() parentForm: any;
  @Input() related_to_id: string;
  @Input() dropDownRelatedId: string;
  @Input() undoOnCancel: any;
  @Input() order: any;
  @Output() trigger = new EventEmitter<any>();
  @Output() setResetProductsForm = new EventEmitter<any>();
  @Output() emitProducts = new EventEmitter<any>();
  @Output() changeProducts = new EventEmitter<any>();
  @Output() changeAddress = new EventEmitter<any>();
  @Output() emitFormsInfo = new EventEmitter<any>();
  @Output() emitUploadInfo = new EventEmitter<any>();
  @Output() changeclietId = new EventEmitter<any>();
  @Input() shipping_id: any;
  @Input() editUpload: any = true; // NON MANDATORY KEY (USED WHEN ADD UPLOAD AND EDIT UPLOAD ARE IN ONE PAGE)
  @Input() Contacts: any;
  @Input() batchId: any;
  @Input() AddressInfo: any;
  @Input() sameAsShipping: boolean;
  @Input() editTypeForRestrict: any;
  @Input() isSubmitBtnClicked: any;
  @Input() getInputValidationTypes: any;
  @Input() is_pallet;
  @Input() metaData;
  @Input() id;
  @Input() address_form_id;
  @Input() uploadDocFlag;
  @Input() isViewMore;
  @Input() customPackingLabel;
  public existingAttributesData: any = [];
  submittedStoresAttributeForm: any = false;
  storesAttributeForm: FormGroup;
  public form_id;
  public clientSelectedId: any;
  public fetchingData = true;
  public sailingDate: Date = new Date();
  public currentDate: Date = new Date();
  public is_automech = App.env_configurations.is_automech;
  public inputValidations = [];
  public now = new Date();
  constructor(
    public service: LeadsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService
  ) {}
  async ngOnInit() {
    this.storesAttributeForm = this.formBuilder.group({
      storeCustomAttributes: this.formBuilder.array([]),
    });
    // if (this.getInputValidationTypes != undefined)
    //   this.inputValidations = this.getInputValidationTypes;
    // else
    //  await this.getValidationTypes();
    await this.getDropdownsList();
    await this.getOrgStoreAttribute();
    this.updateFieldList();
    if (
      this.module === "new_create_package" ||
      this.module === "package_totals"
    ) {
      setTimeout(async () => {
        if (!this.Contacts) {
          await this.handleObjectDependencies(
            "dependent_field",
            "is_pallet",
            false
          );
          this.fetchingData = false;
        }
        // const data = await this.getAttributesPrefillData();

        // this.prefillObject = data;
      }, 200);
    }
    this.storesAttributeForm.valueChanges.subscribe((val) => {
      // console.log(this.storesAttributeForm)
      // this.storesAttributeForm.markAsDirty()
      this.submittedStoresAttributeForm = true;
      if (this.storesAttributeForm.dirty) {
        if (
          this.module === "frieght_form" ||
          this.module === "shipping_details"
        ) {
          localStorage.setItem(
            "freightMetadata",
            JSON.stringify(val.storeCustomAttributes[0])
          );
        }
        this.service.FormSharingData.next(this.storesAttributeForm);
        this.submittedStoresAttributeForm = true;
      }
      const obj = {
        form: this.storesAttributeForm,
        module: this.module,
        parentform: this.parentForm,
        containerform: this.containerForm,
        existingAttributesData: this.existingAttributesData,
        totalClients: this.totalClients,
        estimate_form_id: this.form_id,
        editID: this.editID,
      };
      this.trigger.emit(obj);
    });
    const obj = {
      form: this.storesAttributeForm,
      module: this.module,
      parentform: this.parentForm,
      containerform: this.containerForm,
      existingAttributesData: this.existingAttributesData,
      totalClients: this.totalClients,
      estimate_form_id: this.form_id,
      editID: this.editID,
    };
    this.trigger.emit(obj);
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (changes.is_pallet) {
      let arr = [];
      arr = this.findObjectsWithKeyValue("dependent_field", "is_pallet");
      if (arr.length) {
        arr.forEach((obj: any) => {
          if (
            obj.dependency &&
            obj.dependency.dependent_value == changes.is_pallet.currentValue
          ) {
            obj.is_hide = false;
            const formArray = this.storesAttributeForm.get(
              "storeCustomAttributes"
            ) as FormArray;
            formArray.removeAt(0);
          } else {
            obj.is_hide = true;
            this.group.removeControl(obj.form_control_name);
          }
        });
        this.createAttributeControls();
      }
    }

    if (changes.customPackingLabel) {
      this.handleLabelDependent();
    }

    if (changes.sameAsShipping) {
      if (this.sameAsShipping && this.storesAttributeForm) {
        this.storesAttributeForm.patchValue({
          storeCustomAttributes: [this.AddressInfo],
        });
        const param = {
          id: this.AddressInfo.country_id.id,
          form_control_name: "country_id",
          module: this.module,
        };
        await this.getDynamicOptionsFromApi(param);
      } else {
        if (this.storesAttributeForm) {
          const existingAttributes =
            this.storesAttributeForm.value.storeCustomAttributes[0] || [];
          for (let key in this.AddressInfo) {
            if (this.AddressInfo[key] == existingAttributes[key]) {
              existingAttributes[key] = "";
            }
          }
          this.storesAttributeForm.patchValue({
            storeCustomAttributes: [existingAttributes],
          });
        }
      }
    }

    if (changes.order && changes.order.currentValue) {
      this.order = changes.order.currentValue;
    }
    if (changes.isSubmitBtnClicked) {
      this.submittedStoresAttributeForm =
        changes.isSubmitBtnClicked.currentValue;
    }
    if (
      (changes.undoOnCancel &&
        changes.undoOnCancel.currentValue &&
        this.form_id) ||
      (changes.related_to_id &&
        changes.related_to_id.currentValue &&
        this.form_id)
    ) {
      await this.getAttributesPrefillData();
      this.isDisplayFields();
    }
    if (changes.Contacts && changes.Contacts.previousValue && this.form_id) {
      // this.Contacts = changes.Contacts.currentValue
      if (this.form_id) this.getAttributesPrefillData();
      this.isDisplayFields();
    }

    if (changes.uploadDocFlag && changes.uploadDocFlag.currentValue) {
      this.getAttributesPrefillData();
      this.isDisplayFields();
    }
    if (changes.shipping_id && changes.shipping_id.currentValue) {
      this.shipping_id = changes.shipping_id.currentValue;
    }

    if (
      changes.module &&
      changes.module.currentValue == "add_items_in_estimates"
    ) {
      this.getDropdownsList();
    }

    if (
      this.module == "package_totals" &&
      changes.metaData &&
      changes.metaData.currentValue
    ) {
      if (this.is_pallet) {
        this.setFormControlValue(
          0,
          "net_weight_per_pallet",
          this.metaData?.netWtSubPackage
        );
        this.setFormControlValue(
          0,
          "gross_weight_per_pallet",
          this.metaData?.grossWtSubPackage
        );
      } else {
        this.setFormControlValue(
          0,
          "net_weight_of_package",
          this.metaData?.netWtSubPackage
        );
        this.setFormControlValue(
          0,
          "gross_weight_of_package",
          this.metaData?.grossWtSubPackage
        );
      }
      this.setFormControlValue(
        0,
        "total_net_weight",
        this.metaData?.totalNetWeight
      );
      this.setFormControlValue(
        0,
        "total_gross_weight",
        this.metaData?.totalGrossWeight
      );
    }

    if (
      changes.isViewMore &&
      (changes.isViewMore.previousValue || changes.isViewMore.currentValue)
    ) {
      this.updateFieldList();
    }
  }

  updateFieldList() {
    if (this.isViewMore) {
      // Add only items from hidenFieldsList that are not already in existingAttributesData
      const newItems = this.hidenFieldsList.filter(
        (hiddenItem) =>
          !this.existingAttributesData.some(
            (existingItem) => existingItem.id === hiddenItem.id
          )
      );
      this.existingAttributesData = [
        ...this.existingAttributesData,
        ...newItems,
      ];
    } else {
      // Remove items in hidenFieldsList from existingAttributesData
      this.existingAttributesData = this.existingAttributesData.filter(
        (item) =>
          !this.hidenFieldsList.some((hiddenItem) => hiddenItem.id === item.id)
      );
    }
    this.createAttributeControls();
  }

  prefillShipment() {
    const value = localStorage.getItem("freightMetadata");
    let data = value ? JSON.parse(value) : "";

    this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      .get("mode_transport_id")
      ?.setValue(data.mode_transport_id);
    this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      .get("freight_forwarder")
      ?.setValue(data.freight_forwarder);
    this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      .get("sailing_date")
      ?.setValue(data.sailing_date);
    this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      .get("total_freight_cost")
      ?.setValue(data.total_freight_cost);

    setTimeout(() => {
      const obj = {
        form: this.storesAttributeForm,
        module: this.module,
        parentform: this.parentForm,
        containerform: this.containerForm,
        existingAttributesData: this.existingAttributesData,
        totalClients: this.totalClients,
        estimate_form_id: this.form_id,
        editID: this.editID,
      };
      this.trigger.emit(obj);
    }, 1000);
  }

  loadShipments() {
    let val = localStorage.getItem("mode_of_shipment") as any;
    if (
      (this.form_id == 6 || this.form_id == 3) &&
      localStorage.getItem("freightMetadata") &&
      localStorage.getItem("shipping_details_id") &&
      localStorage.getItem("frieght_form_id")
    ) {
      this.prefillShipment();
    }
    this.existingAttributesData.map((obj: any, index: number) => {
      if (val == 1) {
        if (
          obj.form_control_name === "bol_id" ||
          obj.form_control_name === "bl_date" ||
          obj.form_control_name === "bl_type"
        ) {
          obj.is_hide = true;
        }
        if (
          obj.form_control_name === "shipping_id" ||
          obj.form_control_name === "air_date" ||
          obj.form_control_name === "air_type"
        ) {
          obj.is_hide = false;
        }

        if (
          (obj.form_control_name === "number_of_containers" ||
            obj.label_name == "Dynamic Row Fields") &&
          !this.is_automech
        ) {
          this.group.removeControl("number_of_containers");
          obj.is_hide = true;
        }
      } else {
        if (
          obj.form_control_name === "shipping_id" ||
          obj.form_control_name === "air_date" ||
          obj.form_control_name === "air_type"
        ) {
          obj.is_hide = true;
        }
        if (
          obj.form_control_name === "bol_id" ||
          obj.form_control_name === "bl_date" ||
          obj.form_control_name === "bl_type"
        ) {
          obj.is_hide = false;
        }
        if (
          (obj.form_control_name === "number_of_containers" ||
            obj.label_name == "Dynamic Row Fields") &&
          this.form_id == 3 &&
          !this.is_automech
        ) {
          this.group.addControl(
            "number_of_containers",
            new FormControl("", [Validators.required])
          );
          obj.is_hide = false;
        }
      }
    });
  }

  public prefillObject;
  public uploadObject = [];
  public selectedDropValue;
  public hidenFieldsList = [];
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: this.module,
        related_to_id: this.related_to_id,
        editTypeForRestrict: this.editTypeForRestrict,
      })
      .then(async (response) => {
        if (response.result.success) {
          const list = response.result.data.attributes.base_attributes;
          this.existingAttributesData =
            response.result.data.attributes.base_attributes;
          // this.existingAttributesData = list.filter((ele) => {
          //   return ele.field_visibility;
          // })
          this.hidenFieldsList = list.filter((ele) => {
            return !ele.field_visibility;
          });

          this.selectedDropValue = Array(
            this.existingAttributesData.length
          ).fill(null);

          const indx = _.findIndex(this.existingAttributesData, {
            slug: "upload",
          });

          if (indx > -1) {
            this.uploadObject.push(this.existingAttributesData[indx]);
          }

          if (
            this.module == "customer_purchase_order" ||
            this.module == "other_documents" ||
            this.module == "add_payments"
          ) {
            const uploaddocIndx = _.findIndex(this.existingAttributesData, {
              slug: "upload_documents",
            });
            if (uploaddocIndx > -1) {
              this.uploadObject.push(
                this.existingAttributesData[uploaddocIndx]
              );
            }
          }
          this.form_id = response.result.data.attributes.form_id;
          this.createAttributeControls();
          // if (this.editUpload == true) {
          if (
            (this.module === "add_contact" ||
              this.module === "add_address" ||
              this.module === "add_notify_address" ||
              this.module === "add_billing_address" ||
              this.module === "add_line_items" ||
              this.module === "add_container") &&
            !this.Contacts
          ) {
            // do nothing
          } else {
            // if (this.module !== "new_create_package") {
            // do nothing
            if (this.form_id) {
              const data = await this.getAttributesPrefillData();
              this.prefillObject = data;
            }
            // }
          }
          // }
          this.isDisplayFields();
          if (this.module !== "new_create_package") {
            // do nothing
            this.fetchingData = false;
          }
          if (
            // this.module == "shipping_details" ||
            this.module == "frieght_form"
          ) {
            this.loadShipments();
          }
        }
      })
      .catch((error) => console.log(error));
  }
  public dropdOptions;
  isDisplayFields() {
    if (this.module == "new_create_package") {
      if (
        this.prefillObject

        // &&
        // (this.prefillObject.is_pallet === "" ||
        //   this.prefillObject.is_pallet === false)
      ) {
        // setTimeout(
        //   () => {
        this.handleObjectDependencies(
          "dependent_field",
          "is_pallet",
          this.prefillObject.is_pallet ? this.prefillObject.is_pallet : false
        );
        this.handleLabelDependent();
        this.fetchingData = false;
        // },

        //   100
        // );

        this.existingAttributesData.map(async (obj: any, index: number) => {
          // obj.options = await this.getDynamicArray(index);
          if (!obj.dependent_on_field_id) {
            obj.options = this.dropdOptions?.[obj.form_control_name] || [];
          }
        });

        return;
      }
      //   else {
      //     this.handleObjectDependencies("dependent_field", "is_pallet", false);
      //     return;
      //   }
    }

    // if (this.module === "package_totals") {
    //   this.handleObjectDependencies(
    //     "dependent_field",
    //     "is_pallet",
    //     this.is_pallet
    //   );
    // }
    let renderArry = [];
    renderArry = this.existingAttributesData;
    this.existingAttributesData.map(async (obj: any, index: number) => {
      // obj.options = await this.getDynamicArray(index);
      if (!obj.dependent_on_field_id) {
        obj.options = this.dropdOptions?.[obj.form_control_name] || [];
      }

      if (obj.dependency && obj.dependency.dependent_field) {
        const indx = await _.findIndex(this.existingAttributesData, {
          form_control_name: obj.dependency.dependent_field,
        });
        if (indx > -1) {
          if (
            this.prefillObject &&
            this.prefillObject[obj.dependency.dependent_field] ==
              obj.dependency.dependent_value
          ) {
            obj.is_hide = false;
            this.group.addControl(
              obj.form_control_name,
              new FormControl(this.prefillObject[obj.form_control_name])
            );
          } else {
            this.group.removeControl(obj.form_control_name);
            obj.is_hide = true;
          }
        }
        if (obj.dependency.dependent_field && !obj.dependency.dependent_value) {
          this.enableDependentFields(obj);
        }
      }
      return obj;
    });
  }

  getValidation(obj) {
    if (
      this.storesAttributeForm.controls.storeCustomAttributes[
        "controls"
      ][0].get(obj.form_control_name)
    ) {
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get(obj.form_control_name)
        .setValidators(this.bindValidation(obj));
    }
    this.storesAttributeForm.updateValueAndValidity();
    return [];
  }

  getRegex(validationId) {
    const indx = _.findIndex(this.inputValidations, { id: validationId });
    if (indx > -1) {
      return this.inputValidations[indx].regex;
    }
  }

  bindValidation(ele) {
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
      // list.push(CustomValidation.noWhitespaceValidator);
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
  public group = this.formBuilder.group({});
  createAttributeControls() {
    // Loop through each attribute and add the control to the form group
    this.existingAttributesData.forEach((attr) => {
      // Add control to the form group regardless of whether it's hidden or not
      const control = this.formBuilder.control(
        attr.predefined_value
          ? attr.predefined_value === "false"
            ? false
            : attr.predefined_value
          : ""
      );
      this.group.addControl(attr.form_control_name, control);
    });

    // Push the group to the FormArray, but make sure it's not a duplicate
    if (!this.storeCustomAttributes.controls.includes(this.group)) {
      this.storeCustomAttributes.push(this.group);
    }

    // Apply validation for each attribute
    this.existingAttributesData.forEach((attr) => {
      this.getValidation(attr);
    });
  }

  get storeCustomAttributes() {
    return this.storesAttributeForm.get("storeCustomAttributes") as FormArray;
  }

  async getDynamicArray(index: number) {
    return await this.getDropdownlist(
      this.existingAttributesData[index]?.data_source,
      this.existingAttributesData[index]?.result_object
    );
  }

  filterOpts(options, control, i) {
    if (control) {
      const search_text = control.value;
      const res = options.filter((opt) => {
        return !search_text || opt.label.toLowerCase().startsWith(search_text);
      });
      return res;
    }
  }

  NamefilterOpts(options, control, i) {
    if (control) {
      const search_text = control.value;
      const res = options.filter((opt) => {
        return (
          !search_text ||
          (opt.name ? opt.name.toLowerCase().startsWith(search_text) : "") ||
          (opt.label ? opt.label.toLowerCase().startsWith(search_text) : "")
        );
      });
      return res;
    }
  }
  assignCommonValues(json1, json2) {
    const keys1 = Object.keys(json1);
    const keys2 = Object.keys(json2);
    keys1.forEach((key) => {
      if (keys2.includes(key)) {
        json2[key] = json1[key];
      }
    });

    return json2;
  }
  async getDropdownlist(api: any, resultObj: any) {
    let list = [];
    await this.service
      .getFormDropdowns({
        api: api,
      })
      .then(async (response) => {
        if (response.result.success && response.result.data) {
          const mergedJson = this.assignCommonValues(
            JSON.parse(resultObj),
            response
          );
          const data = JSON.parse(resultObj).response.result.data;
          list = mergedJson.result.data[data.key];
          if (api === "listOrganizations") {
            const indx = _.findIndex(list, {
              id: parseInt(
                this.storesAttributeForm.controls.storeCustomAttributes[
                  "controls"
                ][0].get("organization_id")
              ),
            });
            if (indx > -1) {
              // for initial prefilling select client
              this.existingAttributesData[0].newlabel = list[indx].name;
            }
          }
          return list;
        }
      })
      .catch((error) => console.log(error));
    return list;
  }
  public uploadedFile = "";
  public editID = "";

  async getAttributesPrefillData() {
    if (this.module != "shipping_details") {
      localStorage.removeItem("shipping_details_id");
    }
    let data;
    let isSaveFreight: string;
    await this.service
      .getAttributes({
        related_to_id: this.related_to_id || "",
        // related_to_id: 604,
        overrideForm: this.overrideForm,
        module: this.address_form_id ? this.address_form_id : this.form_id,
        id: this.id || this.Contacts?.id || this.Contacts || this.batchId || "",
      })
      .then(async (response) => {
        if (response.result.success && response.result.data.length) {
          data = response.result.data.length
            ? response.result.data[0].meta_data
            : "";

          this.existingAttributesData.map(async (obj: any, index: number) => {
            // obj.options = await this.getDynamicArray(index);
            if (!obj.dependent_on_field_id) {
              obj.options = this.dropdOptions?.[obj.form_control_name] || [];
            }
            if (obj.slug === "dropdown" || obj.slug === "auto_suggest") {
              const newObj =
                response.result.data[0].meta_data?.[obj.form_control_name];
              if (newObj) {
                const indx = _.findIndex(obj.options, { id: newObj.id });
                if (indx < 0) {
                  obj.options.push(newObj);
                }
              }
            }
          });
          this.editID = data ? response.result.data[0].id : "";
          if (this.uploadObject.length) {
            this.uploadedFile =
              data[this.uploadObject[0].form_control_name] || [];
          } else {
            this.uploadedFile = "";
          }
          isSaveFreight = response.result.data[0]?.isSaveFreight;
          // console.log(this.dropdOptions.organization_id)
          // const orgIndx = _.findIndex(this.dropdOptions.organization_id, {id: data.organization_id})
          // if(orgIndx > -1) {
          //   data.organization_id = this.dropdOptions.organization_id[orgIndx].label;
          // }
          setTimeout(
            () =>
              this.storesAttributeForm.patchValue({
                storeCustomAttributes: [data],
              }),
            200
          );
          if (
            this.module == "frieght_form" ||
            this.module == "shipping_details"
          ) {
            const sailing_date =
              this.storesAttributeForm.controls.storeCustomAttributes[
                "controls"
              ][0].get("shipped_on_board_date")?.value;
            if (sailing_date) this.sailingDate = sailing_date;
          }
          this.submittedStoresAttributeForm = true;
          // this.storesAttributeForm.markAllAsTouched();
          if (this.module !== "add_vendors" && this.module !== "add_client") {
            setTimeout(() => {
              const obj = {
                form: this.storesAttributeForm,
                module: this.module,
                parentform: this.parentForm,
                containerform: this.containerForm,
                existingAttributesData: this.existingAttributesData,
                totalClients: this.totalClients,
                estimate_form_id: this.form_id,
                editID: this.editID,
              };
              this.trigger.emit(obj);
            }, 1000);
          }

          if (
            response.result.data.length &&
            response.result.data[0].form_id == "6"
          ) {
            localStorage.setItem(
              "shipping_details_id",
              response.result.data[0].form_id
            );
          }

          if (
            (this.form_id == 3 || this.form_id == 6) &&
            localStorage.getItem("freightMetadata") &&
            localStorage.getItem("shipping_details_id") &&
            localStorage.getItem("frieght_form_id")
          ) {
            this.prefillShipment();
          }

          if (this.isAddress == true) {
            const orgIndx = _.findIndex(this.dropdOptions.country_id, {
              label: data.country_id,
            });

            const param = {
              id: data.country_id.id,
              form_control_name: "country_id",
              module: this.module,
            };
            let data2: any = await this.getDynamicOptionsFromApi(param);
            this.returnedDynmicDropdowns = data2;
            if (data2) {
              this.changeclietId.emit({
                clientId: this.dropdOptions.organization_id[orgIndx]?.id,
                ...this.returnedDynmicDropdowns,
              });
            }
          }
          if (
            this.module == "create_estimate" ||
            this.module == "create_shipment" ||
            this.module == "create_order"
          ) {
            const orgIndx = _.findIndex(this.dropdOptions.organization_id, {
              id: data.organization_id?.id,
            });
            const param = {
              id: this.dropdOptions.organization_id[orgIndx]?.id,
              form_control_name: "organization_id",
              module: "create_estimate",
            };
            let data2: any = await this.getDynamicOptionsFromApi(param);
            this.returnedDynmicDropdowns = data2;
            if (data2) {
              this.changeclietId.emit({
                clientId: this.dropdOptions.organization_id[orgIndx]?.id,
                ...this.returnedDynmicDropdowns,
              });
            }
          }

          if (this.module == "add_insurance") {
            const policy_start_date =
              this.storesAttributeForm.controls.storeCustomAttributes[
                "controls"
              ][0].get("policy_start_date")?.value;

            this.existingAttributesData.map((obj: any) => {
              if (obj.form_control_name == "policy_end_date") {
                obj["minDate"] = moment(policy_start_date)
                  .add(1, "days")
                  .toDate();
              }
              return obj;
            });
          }
        } else {
          this.storesAttributeForm.reset();
        }
        return data;
      })
      .catch((error) => console.log(error));
    return data;
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  async autoSuggestselectionChange(obj, formdata, indx: any) {
    this.totalClients = formdata.options;
    let i = _.findIndex(<any>formdata.options, {
      label: obj.label,
      id: obj.id,
    });
    // if (formdata.label_name === "Select Client") {
    const param = {
      id: obj.id,
      form_control_name: formdata.form_control_name,
      module: this.module,
    };
    let data: any = await this.getDynamicOptionsFromApi(param);
    this.returnedDynmicDropdowns = data;
    // }
    if (i > -1) {
      formdata.newlabel = obj.name;
      this.clientSelectedId = `${obj.id}`;
      // this.service.sendDynaDropDownResponse({...this.returnedDynmicDropdowns})
      this.changeclietId.emit({
        clientId: this.clientSelectedId,
        ...this.returnedDynmicDropdowns,
      });
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get("primary_email")
        ?.setValue("");
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get("primary_phone")
        ?.setValue("");
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get("ext")
        ?.setValue("");
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get("kindAttn")
        ?.setValue("");
      this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
        .get("attention_id")
        ?.setValue("");
      //  this.changeProducts.emit(event);

      // this.emitProducts.emit({ clientId: obj.id });
    }

    this.existingAttributesData[indx].newlabel = obj.name;
  }
  public selectedCurrency: string;
  public compareContainersId = false;

  async checkBoxSelectionChange(event, formdata, index, formArray) {
    let arr = [];
    arr = this.findObjectsWithKeyValue(
      "dependent_field",
      formdata.form_control_name
    );
    if (arr.length) {
      arr.forEach((obj: any) => {
        if (obj.dependency && obj.dependency.dependent_value == event.checked) {
          obj.is_hide = false;
          const formArray = this.storesAttributeForm.get(
            "storeCustomAttributes"
          ) as FormArray;
          formArray.removeAt(0);
        } else {
          obj.is_hide = true;
          this.group.removeControl(obj.form_control_name);
        }
      });
      this.createAttributeControls();
      if (this.module === "new_create_package") {
        this.setResetProductsForm.emit();
      }
    }
  }
  async handleObjectDependencies(key: string, value: any, expectedValue: any) {
    let arr = [];
    arr = this.findObjectsWithKeyValue(key, value);
    if (arr.length) {
      arr.forEach((obj: any) => {
        if (obj.dependency && obj.dependency.dependent_value == expectedValue) {
          obj.is_hide = false;
        } else {
          obj.is_hide = true;
          this.group.removeControl(obj.form_control_name);
        }
      });
      const formArray = this.storesAttributeForm.get(
        "storeCustomAttributes"
      ) as FormArray;
      formArray.removeAt(0);
      this.createAttributeControls();
      if (this.prefillObject)
        this.storesAttributeForm.patchValue({
          storeCustomAttributes: [this.prefillObject],
        });
    }
  }

  async handleLabelDependent() {
    if (this.module === "new_create_package") {
      this.existingAttributesData.map((obj: any) => {
        let indx = 0;
        if (obj.label_dependent_field_id) {
          let dependentFormControl = this.existingAttributesData.find(
            (item) => item.id === obj.label_dependent_field_id[0]
          ).form_control_name;
          let value =
            this.storesAttributeForm.value.storeCustomAttributes[0][
              dependentFormControl
            ];

          obj.custom_label = value ? "(" + value + ")" : "";
        }
        return obj;
      });
    } else if (this.module === "package_totals") {
      this.existingAttributesData.map((obj: any) => {
        let indx = 0;
        if (obj.form_control_name === "quantity") {
          //  let dependentFormControl = this.existingAttributesData.find(
          //    (item) => item.id === obj.label_dependent_field_id[0]
          //  ).form_control_name;
          //  let value =
          //    this.storesAttributeForm.value.storeCustomAttributes[0][
          //      dependentFormControl
          //    ];

          obj.custom_label = this.is_pallet
            ? "Pallets"
            : this.customPackingLabel
            ? "(" + this.customPackingLabel + ")"
            : "";
        }
        return obj;
      });
    }
  }

  enableDependentFields(obj) {
    if (
      this.storesAttributeForm.controls.storeCustomAttributes[
        "controls"
      ][0].get(obj.dependency.dependent_field).value
    ) {
      obj.is_hide = false;
      const validators = obj.dependency?.required ? [Validators.required] : [];
      this.group.addControl(
        obj.form_control_name,
        new FormControl(
          this.prefillObject ? this.prefillObject[obj.form_control_name] : "",
          validators
        )
      );
      if (obj.dependency.required) {
        obj.required = true;
      } else {
        obj.required = false;
      }
    } else {
      obj.is_hide = true;
      this.group.removeControl(obj.form_control_name);
    }
  }

  async dropDownSelectionChange(event, formdata, index, formArray) {
    // console.log(formdata.id, formArray);
    this.selectedDropValue[index] = event.value.id;
    this.showDate = false;
    let response: any = "";
    const param = {
      id: event.value.id,
      form_control_name: formdata.form_control_name,
      module: this.module,
      related_to_id: this.related_to_id,
    };
    const indx = _.findIndex(formArray, { id: formdata.id });
    if (indx > -1) {
      response = this.getDynamicOptionsFromApi(param);
    }
    // this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
    // .get(formdata.form_control_name)
    // ?.setValue(event.value.id);
    if (formdata.label_name === "Attention") {
      if (response && response.dependentValues) {
        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("primary_phone")
          ?.setValue(response.dependentValues.primary_phone);
        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("account_manager")
          ?.setValue(response.dependentValues.account_manager);
        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("primary_email")
          ?.setValue(response.dependentValues.primary_email);
      }

      // let arr = Object.keys(response.dependentValues).length
      // for(let i = 0; i < arr; i++) {
      //   this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      //   .get(arr[i])
      //   .setValue(response.dependentValues[arr[i]]);
      // }
    }
    if (formdata.label_name === "Category") {
      if (response && response.dependentValues) {
        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("product_types_id")
          .setValue(response.dependentValues.product_types_id);
      }
    }
    let arr = [];
    arr = this.findObjectsWithKeyValue(
      "dependent_field",
      formdata.form_control_name
    );
    if (arr.length) {
      arr.map((obj: any) => {
        if (
          obj.dependency &&
          obj.dependency.dependent_value == event.value.id
        ) {
          obj.is_hide = false;
          const formArray = this.storesAttributeForm.get(
            "storeCustomAttributes"
          ) as FormArray;
          formArray.removeAt(0);
          this.createAttributeControls();
        } else {
          obj.is_hide = true;
          this.group.removeControl(obj.form_control_name);
        }

        if (obj.dependency.dependent_field && !obj.dependency.dependent_value) {
          this.enableDependentFields(obj);
        }
      });
    }

    if (formdata.form_control_name === "currency_id") {
      const indx = _.findIndex(formArray[index].options, {
        id: event.value.id,
      });
      this.selectedCurrency = formArray[index].options[indx];
    }

    if (formdata.form_control_name === "transport_id") {
      localStorage.setItem("mode_of_shipment", event.value.id);
    }

    if (formdata.form_control_name === "transport_id") {
      // if(event.value == this.prefillObject['transport_id']) {
      //     this.compareContainersId = false
      // } else {
      //   this.compareContainersId = true
      // }
      this.existingAttributesData.map((obj: any) => {
        if (!this.is_automech) {
          if (
            event.value.id === 1 &&
            obj.form_control_name === "number_of_containers"
          ) {
            // this.group.get("number_of_containers")?.clearValidators();
            // this.group.get("number_of_containers")?.updateValueAndValidity();

            this.group.removeControl("number_of_containers");
            obj.is_hide = true;
          } else if (
            event.value.id != 1 &&
            obj.form_control_name === "number_of_containers"
          ) {
            // this.group.get("number_of_containers")?.setValidators([Validators.required])
            // this.group.get("number_of_containers")?.updateValueAndValidity();
            this.group.addControl(
              "number_of_containers",
              new FormControl(this.prefillObject["number_of_containers"], [
                Validators.required,
              ])
            );
            obj.is_hide = false;
          }
        }
      });
    }

    this.hideCustomComponents(event.value.id, formdata);
  }
  public returnedDynmicDropdowns: any = [];
  async getDynamicOptionsFromApi(param) {
    let response = "";
    let pload = {
      ...param,
      type: this.Contacts ? "edit" : "false",
    };
    await this.service.getDependentDDS(pload).then((res) => {
      const data = res.result.data;
      response = data;
      if (res.result.success) {
        let keys = [];
        keys = data.dependentDropdowns
          ? Object.keys(data.dependentDropdowns)
          : [];
        keys.length &&
          keys.map((ele: any) => {
            const indx = _.findIndex(this.existingAttributesData, {
              form_control_name: ele,
            });
            if (indx > -1) {
              this.existingAttributesData[indx].options =
                data.dependentDropdowns[ele] || [];
            }
          });
        let prefillValues = [];
        prefillValues = data.dependentValues
          ? Object.keys(data.dependentValues)
          : [];
        prefillValues.length &&
          prefillValues.map((ele: any) => {
            this.storesAttributeForm.controls.storeCustomAttributes[
              "controls"
            ][0]
              .get(ele)
              ?.setValue(data.dependentValues[ele] || "");
          });
      }
    });
    return response;
  }

  hideCustomComponents(value: string, form) {
    this.existingAttributesData.map((obj: any) => {
      if (obj.slug === "custom_component") {
        if (obj.dependency && obj.dependency.dependent_value == value) {
          obj.is_hide = false;
        } else if (obj.dependency && obj.dependency.dependent_value != value) {
          obj.is_hide = true;
        }
        if (form.form_control_name === "transport_id") {
          if (value == "1" && obj.label_name == "Dynamic Row Fields") {
            obj.is_hide = true;
          } else {
            obj.is_hide = false;
          }
        }
      }
    });
  }

  findObjectsWithKeyValue(key, value) {
    const objects = [];
    this.existingAttributesData.forEach((element) => {
      if (element.dependency && element.dependency[key] === value) {
        objects.push(element);
      }
    });
    return objects;
  }

  emitNewProductsData(event: any) {
    this.changeProducts.emit(event);
  }
  getSelectedAddress(event: any) {
    this.changeAddress.emit(event);
  }

  public param = {
    search: "",
    perPage: 25,
  };
  public totalClients = [];
  public clientsStatus;
  public totalPages: number = 0;
  public errormessage = "";
  public showError: boolean = false;
  public addNew: boolean = false;

  public selectedClients(event: any, name?: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "visible";
    }
    this.showError = false;
    const param = {
      search: event,
      form_control_name: name,
      module: this.module,
      type: "",
      id: "",
    };
    // this.param.search = event;
    // this.param.form_control_name = name
    this.service.getDropdowns(param).then((response) => {
      if (response.result.success) {
        this.totalClients = response.result.data[name];
        this.clientsStatus = this.totalClients.filter((x) => {
          return x.status;
        });
        this.addNew = false;
        this.existingAttributesData.map(async (obj: any, index: number) => {
          if (obj.form_control_name === name) {
            obj.options = response.result.data[name];
          }
          return obj;
        });
        if (!response.result.data[name]?.length) {
          this.showError = true;
          this.addNew = true;

          this.errormessage = "No Client Data Found";
        } else {
          this.errormessage = "";
        }
      }
    });
  }

  public clear(value, label) {
    this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
      .get(label)
      ?.setValue("");
    // this.param.search = "";
    this.selectedClients("", label);
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "visible";
    }
    // this.organizationsService
    //   .getOrganizationsList(this.param)
    //   .then((response) => {
    //     if (response.result.success) {
    //       this.totalClients = response.result.data.organization;
    //       this.clientsStatus = this.totalClients.filter((x) => {
    //         return x.status;
    //       });
    //       this.addNew = false;
    //       this.existingAttributesData[indx].options = this.totalClients;
    //     }
    //     if (
    //       !response.result.data.organization?.length ||
    //       !this.clientsStatus?.length
    //     ) {
    //       this.showError = true;
    //       this.addNew = true;

    //       this.errormessage = "No Client Data Found";
    //     }
    //   });
  }
  addOrganization(): void {
    let toast: object;
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: "alert-dialog",
      width: "590px",
      autoFocus: false,
      data: {
        type: "estimate",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        toast = { msg: "Organization saved successfully.", status: "success" };
        this.existingAttributesData.map(async (obj: any, index: number) => {
          obj.options.unshift(result.response);

          return obj;
        });
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  public containerForm;
  getContainerData(ev) {
    this.containerForm = ev.form;
    const obj = {
      form: this.storesAttributeForm,
      module: this.module,
      containerform: ev.form,
      totalClients: this.totalClients,
      estimate_form_id: this.form_id,
      editID: this.editID,
    };
    this.trigger.emit(obj);
    localStorage.setItem(
      "customFields",
      JSON.stringify(this.storesAttributeForm.value)
    );
  }
  onDateChange(event, indx, control_name) {
    if (control_name == "policy_start_date") {
      const policy_start_date =
        this.storesAttributeForm.controls.storeCustomAttributes[
          "controls"
        ][0].get("policy_start_date")?.value;

      this.existingAttributesData.map((obj: any) => {
        if (obj.form_control_name == "policy_end_date") {
          obj["minDate"] = moment(policy_start_date).add(1, "days").toDate();
        }
        return obj;
      });
    }
    let transistTime;
    if (this.is_automech) {
      // do nothing
    } else if (
      this.module === "shipping_details" &&
      (control_name === "estimated_date_of_arrival" ||
        control_name === "shipped_on_board_date")
    ) {
      const est_date = this.storesAttributeForm.controls.storeCustomAttributes[
        "controls"
      ][0].get("estimated_date_of_arrival")?.value;
      const sailing_date =
        this.storesAttributeForm.controls.storeCustomAttributes[
          "controls"
        ][0].get("shipped_on_board_date")?.value;
      this.sailingDate = sailing_date;
      if (est_date && sailing_date) {
        const selectedDate: Date =
          control_name === "estimated_date_of_arrival"
            ? event.target.value
            : new Date(est_date);
        const currentDate: Date =
          control_name === "estimated_date_of_arrival"
            ? new Date(sailing_date)
            : event.target.value;

        // Calculate the time difference in milliseconds
        const timeDifferenceMs: number =
          selectedDate.getTime() - currentDate.getTime();

        // Convert milliseconds to days, hours, minutes, and seconds
        const daysDifference: number = Math.floor(
          timeDifferenceMs / (1000 * 60 * 60 * 24)
        );
        const hoursDifference: number = Math.floor(
          (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesDifference: number = Math.floor(
          (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsDifference: number = Math.floor(
          (timeDifferenceMs % (1000 * 60)) / 1000
        );
        if (hoursDifference > 4 || daysDifference === 0) {
          transistTime = daysDifference + 1 + " Days";
        } else transistTime = daysDifference + " Days";

        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("transit_time")
          .setValue(transistTime);
      }
    } else if (
      this.module == "frieght_form" &&
      control_name === "shipped_on_board_date"
    ) {
      const sailing_date =
        this.storesAttributeForm.controls.storeCustomAttributes[
          "controls"
        ][0].get("shipped_on_board_date")?.value;
      if (sailing_date) this.sailingDate = sailing_date;
    }

    if (control_name == "manufacturing_date") {
      const manufacturing_date =
        this.storesAttributeForm.controls.storeCustomAttributes[
          "controls"
        ][0].get("manufacturing_date")?.value;

      this.existingAttributesData.map((obj: any) => {
        if (obj.form_control_name == "expiry_date") {
          obj["minDate"] = moment(manufacturing_date).add(1, "days").toDate();
        }
        return obj;
      });
    }
  }
  public wordCount = "0";
  updateWordCount(value): void {
    this.wordCount = value.length;
  }
  onKeyUpChange(e: any, type: string) {
    let invalidChars = ["-", "+", "e"];
    if (invalidChars.includes(e.key) && type === "numeric") {
      e.preventDefault();
    }
  }

  emitUploadEvent(ev) {
    // console.log(ev)
    this.emitUploadInfo.emit({
      ...ev,
      success: true,
      form: this.storesAttributeForm,
      uploadObject: this.uploadObject,
      module: this.module,
    });
  }
  async getDropdownsList() {
    let parms = {
      module: this.module,
      form_control_name: "",
      search: "",
      type: "",
      id: "",
      related_to_id:
        this.module === "shipment_other_specifications" && this.related_to_id
          ? this.related_to_id
          : "",
    };
    if (this.batchId || this.Contacts?.id) {
      (parms.type = "edit"), (parms.id = this.batchId || this.Contacts?.id);
    }
    if (this.module == "create_pallet" || this.module == "new_create_package") {
      parms["related_to_id"] = this.dropDownRelatedId;
    }
    await this.service.getDropdowns(parms).then(async (response) => {
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
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }
  totalVal = 0;
  public subTotal: number = 0;

  enterQty(event, formIndex, obj) {
    if (
      this.module == "edit_product_in_customs_inv" ||
      this.module == "add_product_in_create" ||
      this.module == "add_products_in_po" ||
      this.module == "edit_product_in_commercial_inv" ||
      this.module == "add_product_in_shipment" ||
      this.module == "add_product_in_order"
    ) {
      this.totalVal = 0;
      if (obj.label_name == "Quantity") {
        let item = this.storeCustomAttributes.value.at(formIndex);
        this.storeCustomAttributes.at(formIndex).setValue({
          amount: Number((event.target.value * item.price).toFixed(3)),
          name: item.name,
          price: Number(item.price),
          quantity: event.target.value,
          description: item.description,
        });
        this.storesAttributeForm.value.storeCustomAttributes.forEach(
          (obj: any) => {
            this.totalVal = this.totalVal + obj.amount;
          }
        );
      } else if (
        obj.label_name == "Price/Unit" ||
        obj.label_name == "Rate per UOM"
      ) {
        let item = this.storeCustomAttributes.value.at(formIndex);
        this.storeCustomAttributes.at(formIndex).setValue({
          amount: Number((event.target.value * item.quantity).toFixed(3)),
          name: item.name,
          quantity: Number(item.quantity),
          price: event.target.value,
          description: item.description,
        });
        this.storesAttributeForm.value.storeCustomAttributes.forEach(
          (obj: any) => {
            this.totalVal = this.totalVal + obj.amount;
          }
        );
      }
    }
  }
  shouldDisplayEndDate(attr: any): boolean {
    return !!attr.policy_end_date;
  }
  public showDate = false;
  onDropdownClick() {
    this.showDate = true;
  }

  getFormControlValue(formIndex: number, form_control_name: string) {
    return this.storeCustomAttributes.at(formIndex).get(form_control_name).value
      ? this.storeCustomAttributes.at(formIndex).get(form_control_name).value
      : "0";
  }
  // setFormControlValue(formIndex: number, form_control_name: string, value) {
  //   this.storeCustomAttributes
  //     .at(formIndex)
  //     .get(form_control_name)
  //     .setValue(value);
  // }
  setFormControlValue(
    formIndex: number,
    form_control_name: string,
    value: any
  ): void {
    const formGroup = this.storeCustomAttributes.at(formIndex);
    if (formGroup && formGroup.get(form_control_name)) {
      formGroup.get(form_control_name).setValue(value);
    } else {
      console.warn(
        `Form control not found: Index - ${formIndex}, Control - ${form_control_name}`
      );
    }
  }

  getDocUploadEvent(ev) {
    // this.getAttributesPrefillData();
    // this.isDisplayFields();
    this.emitUploadInfo.emit({
      ...ev,
      form: this.storesAttributeForm,
      uploadObject: this.uploadObject,
      module: this.module,
    });
  }

  onInputChange(e: any, obj: any, name: string, formIndex, fieldId) {
    if (name == "total_freight_cost") {
      if (!/^(-?\d+(\.\d{0,3})?)?$/.test(e.target.value)) {
        e.target.value = e.target.value.slice(0, -1);
        this.storesAttributeForm.controls.storeCustomAttributes["controls"][0]
          .get("total_freight_cost")
          ?.setValue(e.target.value);
      }
    }
    if (this.module == "new_create_package") {
    }

    if (this.module === "new_create_package") {
      if (obj.form_control_name == "name") {
        this.existingAttributesData.map((obj: any) => {
          let indx = 0;
          if (obj.label_dependent_field_id) {
            indx = obj.label_dependent_field_id.indexOf(fieldId);
            if (indx > -1 && obj.label_dependent_field_id[indx] == fieldId) {
              obj.custom_label = e.target.value
                ? "(" + e.target.value + ")"
                : "";
            }
          }
          return obj;
        });
      }

      if (
        obj.form_control_name == "net_weight_per_package" ||
        obj.form_control_name == "tare_weight" ||
        obj.form_control_name == "quantity" ||
        obj.form_control_name == "number_of_pallets" ||
        obj.form_control_name == "primary_tare_weight"
      ) {
        // const is_pallet =
        //   this.getFormControlValue(formIndex, "is_pallet") == "0"
        //     ? false
        //     : true;
        // let number_of_pallets = is_pallet
        //   ? this.getFormControlValue(formIndex, "number_of_pallets")
        //   : 1;
        // const net_weight = this.getFormControlValue(
        //   formIndex,
        //   "net_weight_per_package"
        // );
        // const tare_weight = this.getFormControlValue(formIndex, "tare_weight");
        // const quantity = this.getFormControlValue(formIndex, "quantity");
        // const gross_weight = (
        //   parseFloat(net_weight) + parseFloat(tare_weight)
        // ).toFixed(3);
        // const total_net_weight = (
        //   (is_pallet ? parseFloat(number_of_pallets) : 1) *
        //   parseFloat(net_weight) *
        //   parseFloat(quantity)
        // ).toFixed(3);
        // let total_gross_weight;
        // this.setFormControlValue(
        //   formIndex,
        //   "total_net_weight",
        //   total_net_weight
        // );
        // this.setFormControlValue(
        //   formIndex,
        //   "gross_weight_per_package",
        //   gross_weight
        // );
        // if (is_pallet) {
        //   const primary_tare_weight = this.getFormControlValue(
        //     formIndex,
        //     "primary_tare_weight"
        //   );
        //   const net_weight_per_pallet = (
        //     parseFloat(net_weight) * parseFloat(quantity)
        //   ).toFixed(3);
        //   const gross_weight_per_pallet = (
        //     parseFloat(number_of_pallets) * parseFloat(gross_weight)
        //   ).toFixed(3);
        //   total_gross_weight = (
        //     parseFloat(number_of_pallets) *
        //     (parseFloat(quantity) * parseFloat(tare_weight) +
        //       parseFloat(primary_tare_weight) +
        //       parseFloat(net_weight_per_pallet))
        //   ).toFixed(3);
        //   this.setFormControlValue(
        //     formIndex,
        //     "net_weight_per_pallet",
        //     net_weight_per_pallet
        //   );
        //   this.setFormControlValue(
        //     formIndex,
        //     "gross_weight_per_pallet",
        //     gross_weight_per_pallet
        //   );
        // } else {
        //   total_gross_weight = (
        //     parseFloat(total_net_weight) +
        //     parseFloat(quantity) * parseFloat(tare_weight)
        //   ).toFixed(3);
        // }
        // this.setFormControlValue(
        //   formIndex,
        //   "total_gross_weight",
        //   total_gross_weight
        // );
      }
    }

    // if (!this.is_automech) {
    //   if (
    //     (name === "port_of_loading" ||
    //       name === "port_of_discharge" ||
    //       name === "final_destination") &&
    //     e.keyCode == 32
    //   ) {
    //     e.preventDefault();
    //   }
    // }
    const emitObj = {
      form: this.storesAttributeForm,
      module: this.module,
      parentform: this.parentForm,
      containerform: this.containerForm,
      existingAttributesData: this.existingAttributesData,
      totalClients: this.totalClients,
      estimate_form_id: this.form_id,
      editID: this.editID,
      onInputChange: true,
    };
    this.trigger.emit(emitObj);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  displayFn(attr: any): string {
    return attr ? attr.label : "";
  }
}
