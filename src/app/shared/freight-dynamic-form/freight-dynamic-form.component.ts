import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { OrdersService } from "../../services/orders.service";
import { LeadsService } from "../../leads/leads.service";
import * as _ from "lodash";
import { CustomValidation } from '../../custom-format/custom-validation';

declare var App: any;

@Component({
  selector: "app-freight-dynamic-form",
  templateUrl: "./freight-dynamic-form.component.html",
  styleUrls: ["./freight-dynamic-form.component.scss"],
})
export class FreightDynamicFormComponent implements OnInit {
  @Input() storesAttributeForm;
  @Output() trigger = new EventEmitter<any>();
  @Input() saveFreightFlag;
  @Input() transportId


  @Input() clientSelectedId: any;
  @Input() selectedCurrency;
  @Input() module;
  @Input() Contacts: any;
  @Input() allowAddContainer:boolean = true;

  public containerError;
  freightContainerForm: FormGroup;
  public is_automech = App.env_configurations.is_automech;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  public orderId = "";
  public mode_shippiment;
  public typeOfContainer = [
    { name: "Dock LCL", id: "1" },
    { name: "20’STD", id: "2" },
    { name: "20’RFR", id: "3" },
    { name: "40’HC", id: "4" },
    { name: "40’STD", id: "5" },
    { name: "40’RFR", id: "6" },
  ];
  constructor(
    private OrdersService: OrdersService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public service: LeadsService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
    this.service.FormSharingData.subscribe((res: any) => {
      this.mode_shippiment = res.value.storeCustomAttributes[0]?.transport_id;
    });
  }

  async ngOnInit() {
    
    this.freightContainerForm = new FormGroup({
      freighContainerAtrray: new FormArray([]),
    });
    await this.getDropdownsList();
    await this.getOrgStoreAttribute()
    this.freightContainerForm.valueChanges.subscribe((val) => {
      if(val.freighContainerAtrray[0]) {
        localStorage.setItem('containers', JSON.stringify(val.freighContainerAtrray[0]))
      }
      const obj = {
        form: this.freightContainerForm,
      };
      this.trigger.emit(obj);
      if (!this.freighContainerAtrray?.value.length) {
        this.containerError = true;
      }
    });
   

    }


    public form_id= "";
    public productAttributes = []

  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: this.module,
        // related_to_id: this.related_to_id,
      })
      .then(async (response) => {
        if (response.result.success) {
          this.productAttributes = response.result.data.attributes.base_attributes;
          const indx = _.findIndex(this.productAttributes, {
            slug: "upload",
          });


          this.form_id = response.result.data.attributes.form_id;

          if (this.module == "frieght_form") {
            localStorage.setItem("frieght_form_id", this.form_id);
          }
          if (this.module == "shipping_details") {
            localStorage.setItem("shipping_details_id", this.form_id);
          }
          this.createAttributeControls();
          if(this.Contacts) {
            await this.getAttributesPrefillData();
          }
          this.isDisplayFields();
        }
      })
      .catch((error) => console.log(error));
  }
  isDisplayFields() {
    let val = localStorage.getItem("mode_of_shipment") as any;
    // const jsonString = '{"result":{"success":true,"data":{"organization_id":[{"id":1,"label":"Test"},{"id":2,"label":"Test12"},{"id":3,"label":"Test22"},{"id":4,"label":"Test223"}],"currency_id":[{"id":1,"label":"INR"},{"id":2,"label":"USD"},{"id":3,"label":"EUR"}]},"message":"Other Order Details Retrieved Successfully","status_code":200}}';
    // const jsonObject = JSON.parse(jsonString);
    //   this.dropdOptions = jsonObject.result.data;

    console.log(this.productAttributes, "87");
    let renderArry = [];
    const indx = _.findIndex(this.productAttributes, {
      slug: "custom_component",
    });
    if (indx > -1) {
      if (
        this.productAttributes[indx].form_control_name == "add_product"
      ) {
        renderArry =
          this.productAttributes[indx].innerAttributes.base_attributes;
      } else {
        renderArry = this.productAttributes;
      }
    } else {
      renderArry = this.productAttributes;
    }
    console.log(renderArry);
    renderArry.map(async (obj: any, index: number) => {
      // obj.options = await this.getDynamicArray(index);
      obj.options = this.dropdOptions[obj.form_control_name] || [];

      if (obj.dependency && obj.dependency.dependent_field) {
        const indx = await _.findIndex(this.productAttributes, {
          form_control_name: obj.dependency.dependent_field,
        });

      }
      return obj;
    });
  }
  public productsdata = []
  async getAttributesPrefillData() {
    console.log(this.Contacts)
    let data;
    await this.service
      .getAttributes({
        module: this.form_id,
        id: this.Contacts?.id || this.Contacts
      })
      .then((response) => {
        if (response.result.success && response.result.data) {
          // let arr: any = [];
          // arr = response.result.data
          // arr = arr.forEach((ele: any) => {
          // this.productsdata.push(ele.meta_data)

          // }) 
          // console.log(this.productsdata, arr)

          // data = response.result.data[0].meta_data;

          // setTimeout(() => {
          //   this.freightContainerForm.patchValue({
          //     freighContainerAtrray: [...this.productsdata],
          //   });
          // }, 1500)

          response.result.data.forEach((ele: any) => {
            this.productsdata.push(ele.meta_data);
          });
          this.populateForm(this.productsdata);

          console.log(this.freightContainerForm)

          const obj = {
            addProdustsForm: this.freightContainerForm,
            productFormID: this.form_id
          };
          this.trigger.emit(obj);
        }
        return data;
      })
      .catch((error) => console.log(error));
    return data;
  }
  populateForm(products: any[]): void {
    const productItemArray = this.freightContainerForm.get('freighContainerAtrray') as FormArray;
    productItemArray.clear(); // Clear existing items
  
    products.forEach(product => {
      productItemArray.push(this.generateProductDynamicForm(product));
    });
  
    console.log(this.freightContainerForm.value); // Verify form values
  }
  generateProductDynamicForm(item?): FormGroup {
    return this.formBuilder.group({
      id: item?.id != undefined ? item.id : "",
      name: item?.name != undefined ? item.name : "",
      quantity: [
        item?.quantity != undefined ? item.quantity : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      price: [
        item?.price != undefined ? item.price : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      amount: item?.amount != undefined ? item.amount : "",
      description: item?.description != undefined ? item.description : "",

    });
  }
  public dropdOptions = {}
  async getDropdownsList() {
    let parms = {
      module: this.module,
      form_control_name: "",
      search: "",
      type: "",
      id: "",
    };
    await this.service.getDropdowns(parms).then(async (response) => {
      if (response.result.success) {
        this.dropdOptions = response.result.data;
      }
    });
  }

  public group = this.formBuilder.group({});

  createAttributeControls(val?: string) {
    this.productAttributes.map((attr) => {
      let control;
      if (!attr.is_hide) {
        control = this.formBuilder.control(val ? val : "");
        this.group.addControl(attr.form_control_name, control);
      }
    });
    this.group.addControl("id", this.formBuilder.control(""));
    this.freighContainerAtrray.push(this.group);
    this.productAttributes.map((attr) => {
      this.getValidation(attr);
    });

  }

  get freighContainerAtrray() {
    return this.freightContainerForm.get("freighContainerAtrray") as FormArray;
  }

  getValidation(obj) {
    const indx = this.freighContainerAtrray.value.length - 1;
    if (
      this.freightContainerForm.controls.freighContainerAtrray[
        "controls"
      ][indx].get(obj.form_control_name)
    ) {
      this.freightContainerForm.controls.freighContainerAtrray["controls"][indx]
        .get(obj.form_control_name)
        .setValidators(this.bindValidation(obj));
    }
    this.freightContainerForm.updateValueAndValidity();
    return [];
  }

  bindValidation(ele) {
    let list = [];
    if (ele.required) {
      list.push(Validators.required);
      // list.push(Validators.required);
      // list.push(CustomValidation.noWhitespaceValidator);
    }
    if (ele.key === "single_line_text") {
      list.push(CustomValidation.noWhitespaceValidator);
    }
    if (ele.validations && ele.validations.length) {
      if (ele.validations[0].hasOwnProperty("minLength")) {
        list.push(Validators.minLength(ele.validations[0].minLength));
      }
      if (ele.validations[0].hasOwnProperty("maxLength")) {
        list.push(Validators.maxLength(ele.validations[0].maxLength));
      }
      if (ele.validations[0].hasOwnProperty("pattern")) {
        list.push(Validators.pattern(ele.validations[0].pattern));
      }
    }

    return list;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.saveFreightFlag && changes.saveFreightFlag.currentValue) {
      this.prefillContainers();
    }
  }

  prefillContainers() {
    const value = localStorage.getItem('containers');
    let data = value ? JSON.parse(value) : ''
    if(this.freightContainerForm) {
      this.freightContainerForm.patchValue({
        freighContainerAtrray: [data],
      });
    }

  }
  async getFreightForm() {
    await this.OrdersService.getfreight({ orders_id: this.orderId }).then(
      (response) => {
        if (response.result.success) {
          const containers = response.result.data.freightDt?.containers
          if(containers) {
            localStorage.setItem('containers', JSON.stringify(containers))
          }
          // this.setcontainerForm(response.result.data.freightDt?.containers);
        }
      }
    );

  }
  
  // setcontainerForm(data) {
  //   if (data?.length > 0) {
  //     data.forEach((value) => {
  //       this.addRowsFreightCost(value);
  //     });
  //   } else {
  //     this.addRowsFreightCost()
  //   }
  // }
  // addRowsFreightCost(value?) {
  //   this.freighContainerAtrray = this.freightContainerForm.get(
  //     "freighContainerAtrray"
  //   ) as FormArray;
  //   this.freighContainerAtrray.push(this.generateFreightDynamicForm(value));
  //   this.containerError = false;
  // }
  deleteRowFreight(index) {
    if (this.freightContainerForm.value.freighContainerAtrray.length === 1) {
      this.containerError = true;
    }
    this.freighContainerAtrray.removeAt(index);
    this.freightContainerForm.markAsDirty();
  }
  generateFreightDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      carrier_seal_number: [
        item?.carrier_seal_number != undefined ? item.carrier_seal_number : "",
        this.is_aapl ? [Validators.pattern(/^[a-zA-Z0-9]*$/)] : null,
      ],
      customs_seal_number: [
        item?.customs_seal_number != undefined ? item.customs_seal_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      rfid_number: [
        item?.rfid_number != undefined ? item.rfid_number : "",
        this.is_aapl ? [Validators.pattern(/^[a-zA-Z0-9]*$/)] : null,
      ],
      container_number: [
        item?.container_number != undefined ? item.container_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      type_of_container: [
        item?.type_of_container != undefined ? item.type_of_container : "",
      ],
      freight_cost_container: [
        item?.freight_cost_container != undefined
          ? item.freight_cost_container
          : "",
        Validators.pattern(/^[0-9.]*$/),
      ],
      transport_vehicle_number: [
        item?.transport_vehicle_number != undefined
          ? item.transport_vehicle_number
          : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      transport_cost_per_truck: [
        item?.transport_cost_per_truck != undefined
          ? item.transport_cost_per_truck
          : "",
        this.is_aapl ? [Validators.pattern(/^[0-9.]+$/)] : null,
      ],
      max_permissible_weight: [
        item?.max_permissible_weight != undefined
          ? item.max_permissible_weight
          : "",
        this.is_automech
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
    });
  }

  addNewLine(value?) {
    let group2 = this.formBuilder.group({});

      // this.freighContainerAtrray = this.productsDynamicForm.get(
      //   "freighContainerAtrray"
      // ) as FormArray;
      this.productAttributes.map((attr) => {
        let control;
        if (!attr.is_hide) {
          control = this.formBuilder.control("");
          group2.addControl(attr.form_control_name, control);
        }
      });
      group2.addControl("id", this.formBuilder.control(""));
      this.freighContainerAtrray.push(group2);
      this.productAttributes.map((attr) => {
        this.getValidation(attr);
      });

      console.log(this.freighContainerAtrray)

      // this.freighContainerAtrray.push(this.generateProductDynamicForm(value));
   
  }
  selectFreight(data?: any) {}
}
