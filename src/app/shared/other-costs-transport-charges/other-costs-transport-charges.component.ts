import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrdersService } from "../../services/orders.service";
import { ActivatedRoute } from "@angular/router";
declare var App: any;
@Component({
  selector: "app-other-costs-transport-charges",
  templateUrl: "./other-costs-transport-charges.component.html",
  styleUrls: ["./other-costs-transport-charges.component.scss"],
})
export class OtherCostsTransportChargesComponent implements OnInit {
  public othertransportForm;
  @Input() storesAttributeForm;
  public orderId: string = "";
  public othercostArray: FormArray;
  @Output() trigger = new EventEmitter<any>();
  public is_aapl = App.env_configurations?.is_aapl;
  public is_automech = App.env_configurations?.is_automech;
  public addButtonTxt: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
  }

  ngOnInit(): void {
    if (this.is_aapl) {
      this.addButtonTxt = "Miscellaneous";
    }
    if (this.is_automech) {
      this.addButtonTxt = "Transport Charges";
    }
    this.othertransportForm = new FormGroup({
      othercostArray: new FormArray([]),
    });
    this.othertransportForm.valueChanges.subscribe((val) => {
      const obj = {
        form: this.othertransportForm,
      };
      this.trigger.emit(obj);
    });
    this.getOtherCosts();
  }

  deleteRowOther(index) {
    this.othercostArray.removeAt(index);
    // this.otherCosts.markAsDirty();
    this.othertransportForm.markAsDirty();
  }

  addRowsotherCost(value?) {
    this.othercostArray = this.othertransportForm.get(
      "othercostArray"
    ) as FormArray;
    this.othercostArray.push(this.generateotherDynamicForm(value));
  }

  generateotherDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      transport_charge: [
        item?.transport_charge != undefined ? item.transport_charge : "",
        Validators.pattern(/^[^A-Za-z]*$/),
      ],
      transport_refrence: [
        item?.transport_refrence != undefined ? item.transport_refrence : "",
        Validators.pattern(/^[0-9]+$/),
      ],
    });
  }

  getOtherCosts() {
    this.OrdersService.getOtherCosts({
      orders_id: this.orderId,
    }).then((response) => {
      if (response.result.success) {
        this.setOtherCosts(response.result.data);
      }
    });
  }

  setOtherCosts(data) {
    for (let i = 0; i < data?.transport_charges.length; i++) {
      this.addRowsotherCost(data.transport_charges[i]);
    }
  }
}
