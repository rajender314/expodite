import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrganizationsService } from '../../../services/organizations.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { ViewEncapsulation } from '@angular/core';
import { language } from '../../../language/language.module';
import { MatExpansionModule } from '@angular/material/expansion';

declare var App: any;

@Component({
  selector: 'app-organizations-products',
  templateUrl: './organizations-products.component.html',
  styleUrls: ['./organizations-products.component.scss'],
  // providers: [OrganizationsService, SnakbarService],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationsProductsComponent implements OnInit {

  @Input() Organization;
  @Output() updateProducts = new EventEmitter<object>();
  public productTypes: Array<any> = [];
  public language = language;
  public currency = '';
  activeState: boolean;
  client_interface: boolean;
  noProducts = false;
  inputEdit: boolean;
  factoryProfile: boolean;
  constructor(
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    private snackbar: SnakbarService
  ) {

  }

  ngOnInit() {
    let factory_profile: boolean;
    // this.organizationsService.productsList.next(this.productTypes);
    setTimeout(() => {
      App.user_roles_permissions.map(function (val) {
        if (val.code == 'factory_user') {
          if (val.selected) {
            factory_profile = true;
          } else {
            factory_profile = false;
          }
        }
      })
      this.factoryProfile = factory_profile;
    }, 1000);

  }
  abc: Array<any>;
  getProductTypesData(): void {

    this.activeState = false;
    let clientVisible: boolean;
    setTimeout(() => {
      App.user_roles_permissions.map(function (value) {
        switch (value.code) {
          case 'client_interface':
            if (value.selected) {
              clientVisible = false;
            } else {
              clientVisible = true;
            }
            break;


        }
      });
      this.client_interface = clientVisible;
    }, 100);


    this.organizationsService
      .getProductsList({ org_id: this.Organization.id })
      .then(response => {
        if (response.result.success) {
          this.productTypes = response.result.data.productTypesDt;
          this.currency = response.result.data.currency;
          this.organizationsService.clientCurrency.next(this.currency);
          if (this.productTypes.length) {
            this.noProducts = false;
          } else {
            this.noProducts = true;
          }
        }

        else {
          this.productTypes = [];
          this.noProducts = true;
        }

      })
      .catch(error => console.log(error))
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.Organization) {
      this.getProductTypesData();
    }
  }

  saveProductData(): void {
    console.log("save products::")
    let productIds = [];
    let toast: object;
    this.organizationsService
      .saveProductTypes({ organization_id: this.Organization.id, productArr: this.productTypes })
      .then(response => {
        if (response.result.success) {
          toast = { msg: " Products saved successfully.", status: "success" };
          this.snackbar.showSnackBar(toast);
          this.inputEdit = false;
          this.updateProducts.emit({ id: this.Organization.id });
        }
        this.activeState = false;
      })

      .catch(error => console.log(error))
  }

  check(id): void {
    this.activeState = true;
  }
  productTypeChange(data: any): void {

    data.checked_status = !data.checked_status;

    this.activeState = true;

  }
  cancelProductTypes(): void {
    this.getProductTypesData();
    this.inputEdit = false;
    this.activeState = false;
  }
  inputEnter($event): void {
    this.inputEdit = true;
    this.activeState = true;
  }
}


