import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { LeadsService } from "../../leads/leads.service";
import { OrdersService } from "../../services/orders.service";
import { CustomValidation } from "../../custom-format/custom-validation";
declare var App: any;

@Component({
  selector: "app-shipping-containers",
  templateUrl: "./shipping-containers.component.html",
  styleUrls: ["./shipping-containers.component.scss"],
})
export class ShippingContainersComponent implements OnInit {
  @Input() storesAttributeForm;
  @Input() order;
  @Output() trigger = new EventEmitter<any>();
  @Input() saveFreightFlag;

  shippingContainer: FormGroup;
  public shippingContainerArray: FormArray;
  public orderId = "";
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  public is_automech = App.env_configurations.is_automech;

  constructor(
    private OrdersService: OrdersService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public service: LeadsService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
  }


  async ngOnInit() {
    this.shippingContainer = new FormGroup({
      shippingContainerArray: new FormArray([]),
    });

    await this.getShippingAddressDetails();
    this.shippingContainer.valueChanges.subscribe((val) => {
      if(val.shippingContainerArray[0]) {
        localStorage.setItem('containers', JSON.stringify(val.shippingContainerArray[0]))
      }

      const obj = {
        form: this.shippingContainer,
      };
      this.trigger.emit(obj);
    });

  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.saveFreightFlag && changes.saveFreightFlag.currentValue) {
      await this.getShippingAddressDetails();
      this.prefillContainers();
    }
  }

  prefillContainers() {
    const value = localStorage.getItem('containers');
    let data = value ? JSON.parse(value) : ''
    if(this.shippingContainer) {
      this.shippingContainer.patchValue({
        shippingContainerArray: [data],
      });
    }
  
  }


  setShippingContainer(data) {
    while (this.shippingContainerArray?.length > 0) {
      this.shippingContainerArray.removeAt(0);
    }
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addShippingContainer(value);
      });
    }
  }
  addShippingContainer(value?) {
    this.shippingContainerArray = this.shippingContainer.get(
      "shippingContainerArray"
    ) as FormArray;
    this.shippingContainerArray.push(this.generateshippingDynamicForm(value));
    const obj = {
      form: this.shippingContainer,
    };
    this.trigger.emit(obj);
  }
  generateshippingDynamicForm(item): FormGroup {
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

  async getShippingAddressDetails() {
    await this.OrdersService.getShippingDetails({
      invoice_id: this.order.invoice.length
        ? this.order.invoice[0].Inovice.id
        : "",
    }).then((response) => {
      if (response.result.success) {
        const containers = response.result.data.freightDt?.containers
        if(containers) {
          localStorage.setItem('containers', JSON.stringify(containers))
        }
        this.setShippingContainer(
          response.result.data.shipContainers?.containers
        );
      }
    });
  }
}
