import { Component, OnInit, Inject, ViewEncapsulation, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { Router, NavigationStart } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OrganizationsService } from '../../services/organizations.service';
import { AdminService } from '../../services/admin.service';
import { OrdersService } from '../../services/orders.service';
import { language } from '../../language/language.module';
import { Param } from './../../custom-format/param';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelect } from '@angular/material/select';
import { SelectModule } from 'ng2-select';
import { NgSelectModule } from '@ng-select/ng-select';
import { trigger, style, state, transition, animate, keyframes, query, stagger } from '@angular/animations';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import * as moment from 'moment';



declare var App: any;
@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrganizationsService, OrdersService, AdminService],
  animations: [
    trigger('stepTransition', [
      state('previous', style({ height: '100px', visibility: 'hidden' })),
      state('next', style({ height: '100px', visibility: 'hidden' })),
      state('current', style({ height: '*', visibility: 'visible' })),
      transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class CreatePurchaseOrderComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  // @ViewChild("myFoucs" , {static: false}) inputElement: ElementRef;
  @ViewChild("productsForm") formEl: ElementRef;
  @ViewChild('stepper') stepper: MatStepper;
  public language = language;
  

  searchCtrl = new FormControl();
  productName = [];
  public modelData: any = {};
  clientsForm: FormGroup;
  shippingAddressDetails = {
    address1: '',
    address2: '',
    state: '',
    country: '',
    postal_code: ''

  }
  billingAddressDetails = {
    address1: '',
    address2: '',
    state: '',
    country: '',
    postal_code: ''

  }
  notifyAddressDetails = {
    address1: '',
    address2: '',
    state: '',
    country: '',
    postal_code: ''

  }
  productsForm: FormGroup;
  addressForm: FormGroup;
  orderData = {
    poNumber: '',
    po_date: '',
    email: '',
    ext: '',
    phone: '',
    kindAttn: '',
    delivery_date: '',
    productArr: [],
    special_instructions: ''
  }
  createAddressForm: FormGroup;
  private phoneNumberPattern = /^[0-9]{10}$/;
  private emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  public items = [{ id: 1, name: "123", email: "1243@gmail.com", phone: "9999" }, { id: 2, name: "234", email: "1243@gmail.com", phone: "9999" }];
  public order = {
    clientSubmit: false,
    productSubmit: false,
    addressSubmit: false,
    createAddSubmit: false,
    organizations: [],
    selectedOrg: "",
    products: [],
    selectedProducts: [],
    selectedProductsError: false,
    selectedBillingError: false,
    selectedShippingError: false,
    selectedNotifyError: false,
    clientAddress: [],
    companyAddress: [],
    notifyAddress: [],
    clientContacts: [],
    po: "",
    special_instructions: "Special Instructions",
    email: "abc@gmail.com",
    phone: "9999999999",
    po_no: "",
    countries: [],
    states: [],
    countriesStates: [],
    filename: '',
    original_name: '',
    src_name: '',
    address_types: [],
    addressType: '',
    currency: '',
    uploadError: false
  };
  sizeError: boolean;
  uploadImage = false;
  public contactsList = [];
  public App = App;
  selectedProduct: any;
  productSubmit: boolean;
  addressSubmit: boolean;
  uploads = [];
  totalPages: number = 0;
  totalCount: number = 0;
  pointerEvent: boolean;
  price: string;
  public errormessage : any;
  public now: Date = new Date();
  deliveryDate: any;
  poDate: any;
  private imageUploadUrl = App.base_url + 'uploadOrderPo';
  public flag : any = 1;
  public hasDropZoneOver: boolean = false;
  public createbtnDisabled: boolean = false;
  public selectAuto : boolean = false;
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/doc', 'application/docx'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true
  });
  public showError : boolean = false;
  private param: any = {
    page: 1,
    perPage: 25,
    sort: 'ASC',
    search: '',
    flag: 1
  }
  confirOrderLoad:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CreatePurchaseOrderComponent>,
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  dialogRef.disableClose = true;
    this.uploader
      .onBeforeUploadItem = (fileItem: any) => {
        fileItem.formData.push({ 123: 234 });
      }
    this.uploader.onAfterAddingFile = (item: any) => {
      this.pointerEvent = true;
    }
    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      // this.uploadImage = true;
      if (item.size >= options.maxFileSize) {
        // console.log('largeFile')
        this.sizeError = true
        this.uploadImage = false;
      } else {
        this.uploadImage = true;
        this.sizeError = false
      }


    };
    this.uploader
      .onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        let obj = JSON.parse(response);
        if (obj.result.success) {
          this.uploads.push(obj.result.data);
          this.order.uploadError = false;
          this.uploadImage = false;
          this.sizeError = false;
        }
      }
  }

  ngOnInit() {
    this.generateClientsForm();
    this.getOrganizations(this.param);
    this.getContacts();
    console.log(App.user_details);
  }

  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.sizeError = false;
    this.uploads.splice(index, 1);
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {

  }

  fileSelected(event): void {

  }

  addNewUser(event) {
    // console.log(event)
  }
  public noWhitespaceValidator(control: FormControl) {

    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { 'whitespace': true };
  }
  generateClientsForm(): void {
    this.clientsForm = this.formBuilder.group({
      client: [null, Validators.required],
      kindAttn: [null],
      phone: [null],
      ext: [null],
      email: [null],
      delivery_date: [null],
      special_instructions: [null],
    });
    // this.productsForm = this.formBuilder.group({
    //   special_instructions: "",
    //   email: [null, [Validators.required, Validators.email]],
    //   phone: [null, Validators.required],
    //   po_no: [null, [Validators.required, this.noWhitespaceValidator]],
    //   po_date: [null],
    //   ext: [null],
    //   kindAttn: [null, Validators.required],
    //   delivery_date: [null, Validators.required],
    // });
    // this.addressForm = this.formBuilder.group({
    //   client: [null, Validators.required]
    // });
    this.createAddressForm = this.formBuilder.group({
      address1: [null, [Validators.required, this.noWhitespaceValidator]],
      address2: "",
      postal_code: "",
      city: "",
      country: "",
      state: "",
      address_type_id: ""
    });
  }

  getOrganizations(param: object) {
    this.organizationsService
      .getOrganizationsList(param)
      .then(response => {
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          this.order.organizations = response.result.data.organization;
        }
      });
    if (App.user_details.log_type == '2') {
      this.getProducts();
    }
  }
  getContacts() {
    this.organizationsService
      .listContacts({ org_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : this.clientsForm.controls.client.value) })
      .then(response => {
        if (response.result.data.contactsData) {
          this.order.clientContacts = response.result.data.contactsData;
          let contacts = [];
          this.order.clientContacts.map(function (value) {
            value.contact['id'] = value.contact.id;
            value.contact['name'] = value.contact.first_name + ' ' + value.contact.last_name;
            value.contact['email'] = value.contact.primary_email;
            value.contact['phone'] = value.contact.primary_phone;
            contacts.push(value.contact);
          });
          // console.log(contacts)
          this.contactsList = contacts;
        }
      }).catch(error => console.log(error))
  }
  getProducts() {
    //if(!this.order.products.length){
    this.organizationsService
      .getProductsList({ org_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : this.clientsForm.controls.client.value) })
      .then(response => {
        if (response.result.success) {
          this.order.products = response.result.data.productTypesDt;
          this.order.currency = response.result.data.currency;
          this.order.products.map(function (value) {
            value['selected'] = false;
            value['error'] = false;
            value['quantity'] = '';
            value['shownEditMode'] = false;
          });
        }
      });
  }
  selectedProductRange(product: any, event?: any): void {

    let quantity = product.quantity;
    let quantityPrice: any;
    // console.log(quantity)
    product.priceRange.map(function (value) {

      //console.log(value.end_qty)
      if (quantity >= value.start_qty && quantity <= value.end_qty) {

        quantityPrice = value.range_price

      }

    });
    // console.log(quantityPrice)
    product.price = quantityPrice;


  }
  

  getAddress(loadAddress?: any) {
    //if((!this.order.clientAddress.length && !this.order.companyAddress.length) || loadAddress){
    this.organizationsService
      .ListAddress({ org_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : this.clientsForm.controls.client.value), orders: true })
      .then(response => {
        if (response.result.success) {
          let addressDetails = [];
          this.order.clientAddress = [];
          this.order.companyAddress = [];
          this.order.notifyAddress = [];
          addressDetails = response.result.data.address_organization
          addressDetails.forEach(val => {
            if(val.address_type_id == 4) {
              let address : any;
              address= Object.assign([],val)
              address = this.order.clientAddress.push(address)
              // console.log(address)
            }
            if(val.address_type_id == 2) {
              let data: any;
              data = Object.assign([],val)
              data = this.order.companyAddress.push(data)
              // console.log(data)
            }
            if(val.address_type_id == 11) {
              let notifyData: any;
              notifyData = Object.assign([],val)
              notifyData = this.order.notifyAddress.push(notifyData)
              // console.log(data)
            }
          });
          // this.order.clientAddress = _.cloneDeep(response.result.data.address_organization);
          // this.order.companyAddress = _.cloneDeep(response.result.data.address_organization);
          //this.order.clientAddress = Object.assign([],response.result.data.address_organization);
          //this.order.companyAddress = Object.assign([],response.result.data.address_organization);

          this.order.clientAddress.map(function (value) {
            value['selected'] = false;
            if (loadAddress == value.id) {
              value['selected'] = true;
            }
          });
          this.order.companyAddress.map(function (value) {
            value['selected'] = false;
            if (loadAddress == value.id) {
              value['selected'] = true;
            }
          });
          this.order.notifyAddress.map((value, index) => {
            value['selected'] = false;
            if (this.order.notifyAddress.length == 1) {
              value['selected'] = true;
            }
          });

        }
      });
    //}
  }

  goToProducts(stepper: MatStepper) {
    // console.log(this.order.products)
    this.clientsForm.get('client').markAsTouched({ onlySelf: true });
    if (this.clientsForm.valid) {
      stepper.next();
      this.getProducts();
      this.getContacts();
      this.productSubmit = false
      this.clientsForm.patchValue({
        phone: "",
        email: "",
        kindAttn: "",
        delivery_date: ""

      })


    }
  }

  goToAddress(stepper: MatStepper) {
    this.productSubmit = true
    if (this.App.user_details.log_type != '2') {
      stepper.selectedIndex = 3;
    } else {
      stepper.selectedIndex = 2;
    }
    return
    if(this.productsForm.invalid){
      setTimeout(() => {
          let scrollTag = document.querySelector('.error-msg');
          if (scrollTag) {
          scrollTag.scrollIntoView();
          }
        }, 1000);
    }
    this.addressSubmit = false
    let productValue = []
    this.productsForm.get('email').markAsTouched({ onlySelf: true });
    this.productsForm.get('phone').markAsTouched({ onlySelf: true });
    this.productsForm.get('po_no').markAsTouched({ onlySelf: true });
    this.productsForm.get('kindAttn').markAsTouched({ onlySelf: true });
    this.productsForm.get('delivery_date').markAsTouched({ onlySelf: true });
    this.order.selectedProducts = [];
    let selectedProductPrice = [];
    selectedProductPrice = this.order.products.filter(function (value) {
      if (value['selected'] && (value['quantity'] == '' || value['quantity'] == null)) {
        value['error'] = true;
        
        return true;
      }
      value['error'] = false;
      return false;
    });
    // console.log(selectedProductPrice)
    this.order.selectedProducts = this.order.products.filter(function (value) {
      if (value['selected']) {
        // console.log(value)
        productValue.push(value)
        return true;
      }
      return false;
    });
    this.selectedProduct = productValue;
    if (!this.order.selectedProducts.length) {
      this.order.selectedProductsError = true;
     
    } else {
      this.order.selectedProductsError = false;
    }
    if (this.uploads.length) {
      this.order.uploadError = false;
    } else {
      this.order.uploadError = true;
    }
    
    // console.log(this.productsForm)
    if (this.productsForm.valid
      && this.order.selectedProducts.length
      && !selectedProductPrice.length) {
      stepper.next();
      this.getAddress();
    } else {
      
      // angular.element($document[0].querySelector('input.ng-invalid'))[0].focus();
      if (this.productsForm.controls.po_no.hasError) {
        this.inputEl.nativeElement.focus()

      }

    }
    
  }

  goToCreateAddress(stepper: MatStepper, type: any) {

    this.createAddressForm.patchValue({
      address1: "",
      address2: "",
      postal_code: "",
      city: "",
      country: "",
      state: "",
      address_type_id: ""
    });
    this.order.addressType = type;
    stepper.next();
    this.getGlobalDetails(this.order.addressType);
    
  }

  public dummyData = {
    attach_arr: "",
    category_name: "",
    checked_status: true,
    error: false,
    id: 68,
    name: "",
    price: "65",
    priceRange: [],
    price_format: "65",
    quantity: "",
    selected: false,
    shownEditMode : true
  }
  public shownEditMode = false;
  addVendorProducts() {
    let indx = this.order.products.length
    console.log(indx)
    
    this.shownEditMode = true;
    this.order.products.push(this.dummyData);
    console.log(this.order.products)
  }

  getGlobalDetails(type): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then(response => {
        if (response.result.success) {
          this.order.address_types = response.result.data.address_types;
          this.order.countries = response.result.data.countries;
          this.order.countriesStates = response.result.data.countriesStates;
          if (this.order.address_types.length) {

            if (this.order.addressType == 'client') {
              this.createAddressForm.patchValue({
                address_type_id: this.order.address_types[2].id
              });

            } else if (this.order.addressType == 'company') {
              this.createAddressForm.patchValue({
                address_type_id: this.order.address_types[1].id
              });

            } else if (this.order.addressType == 'notify') {
              this.createAddressForm.patchValue({
                address_type_id: this.order.address_types[0].id
              });
            }
            // this.createAddressForm.patchValue({
            //     address_type_id: this.order.address_types[0].id
            // });
          }
          if (this.order.countries.length) {
            this.createAddressForm.patchValue({
              country: this.order.countries[0].id
            });
          }
          this.order.states = this.order.countriesStates[this.createAddressForm.value.country];
          if (this.order.countriesStates.length) {
            this.createAddressForm.patchValue({
              state: this.order.states[0].id
            });
          }
        }
      });
  }

  onCountryChange(data?: any): void {
    this.order.states = this.order.countriesStates[this.createAddressForm.value.country];
    this.addressForm.patchValue({
      state: this.order.states[0].id
    });
  }

  createAddress(form, stepper: MatStepper) {
    form.get('address1').markAsTouched({ onlySelf: true });
    form.value['address_count'] = this.order.clientAddress.length + 1;
    // console.log(form.value['address_count'])
    if (form.valid) {
      this.organizationsService
        .OrganizationAddress({
          address1: form.value.address1,
          address2: form.value.address2,
          address_type_id: form.value.address_type_id,
          city: form.value.city,
          country_id: form.value.country,
          id: 0,
          org_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : this.clientsForm.controls.client.value),
          postal_code: form.value.postal_code,
          state_province_id: form.value.state,
          address_count: form.value.address_count,
        })
        .then(response => {
          if (response.result.success) {
            stepper.previous();
            this.getAddress(response.result.data.address_organization[0].id);
          }
        });
      /*if(this.order.addressType=='client'){
          this.organizationsService
          .OrganizationAddress({
              address1: form.value.address1,
              address2: form.value.address2,
              address_type_id: form.value.address_type_id,
              city: form.value.city,
              country_id: form.value.country,
              id: 0,
              org_id: this.clientsForm.controls.client.value,
              postal_code: form.value.postal_code,
              state_province_id: form.value.state,
          })
          .then(response => {
              if(response.result.success){
                stepper.previous();
                this.getAddress(true);
              }
          });
      }else{
        this.adminService
          .addContactAddress({
              address1: form.value.address1,
              address2: form.value.address2,
              address_type_id: form.value.address_type_id,
              city: form.value.city,
              country_id: form.value.country,
              id: 0,
              org_id: this.clientsForm.controls.client.value,
              postal_code: form.value.postal_code,
              state_province_id: form.value.state,
          })
          .then(response => {
            if(response.result.success){
              stepper.previous();
              this.getAddress(true);
            }
          });
      }*/
    }
  }

  createOrder(stepper: MatStepper) {
    this.addressSubmit = true;
    // console.log(this.deliveryDate)
    // if (this.productsForm.invalid) {
      setTimeout(() => {
        let scrollTag = document.querySelector('.error-msg');
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    // }
    let clientAddress = this.order.clientAddress.filter(function (value) {
      if (value['selected']) {
        return true;
      }
      return false;
    });
    if (!clientAddress.length) {
      this.order.selectedShippingError = true;
    } else {
      this.order.selectedShippingError = false;
    }
    let companyAddress = this.order.companyAddress.filter(function (value) {
      if (value['selected']) {
        return true;
      }
      return false;
    });
    if (!companyAddress.length) {
      this.order.selectedBillingError = true;
    } else {
      this.order.selectedBillingError = false;
    }
    let notifyAddress = [];
    if(this.order.notifyAddress.length) {
      notifyAddress = this.order.notifyAddress.filter(function (value) {
        if (value['selected']) {
          return true;
        }
        return false;
      });

      if (!notifyAddress.length) {
        this.order.selectedNotifyError = true;
      } else {
        this.order.selectedNotifyError = false;
      }
    }

    
    
    if (clientAddress.length && companyAddress.length && (this.order.notifyAddress.length ? notifyAddress.length : !notifyAddress.length)) {
      let selectedProducts = [];
      if (this.uploads.length) {
        this.order.filename = this.uploads[0].filename;
        this.order.original_name = this.uploads[0].original_name;
        this.order.src_name = this.uploads[0].source_path;
      }
      this.order.selectedProducts.map(function (value) {
        //products_types_id,quantity,price
        selectedProducts.push({ price: value.price, quantity: value.quantity, products_types_id: value.id });
      });
      // console.log(stepper)
      if (this.App.user_details.log_type != '2') {
        stepper.selectedIndex = 4;
      } else {
        stepper.selectedIndex = 3;
      }

      this.orderData = {
        poNumber: this.productsForm.controls.po_no.value,
        po_date: this.productsForm.controls.po_date.value,
        email: this.productsForm.controls.email.value,
        phone: this.productsForm.controls.phone.value,
        ext: '',
        kindAttn: this.productsForm.controls.kindAttn.value,
        delivery_date: this.productsForm.controls.delivery_date.value,
        productArr: selectedProducts,
        special_instructions: this.productsForm.controls.special_instructions.value
      }
      // console.log(this.orderData)

    }
  }

  changeUser() {
    //contactsList
    let clientPhone = "";
    let clientEmail = "";
    let clientExt = "";
    let attachment_id = this.productsForm.value.kindAttn;

    this.contactsList.map(function (value) {
      // console.log(value.name)
      // console.log(attachment_id)
      if (value.name == attachment_id) {
        // console.log(value.email)
        clientPhone = value.phone;
        clientExt = value.ext;
        clientEmail = value.email;
        // console.log(value)
      }

    });
    // console.log(this.contactsList)

    this.productsForm.patchValue({
      phone: clientPhone,
      ext: clientExt,
      email: clientEmail

    })

  }

  changeCheckbox(data: any): void {
    // let productData =[]
    // if (!data.selected) {
    //   this.productName.push(data)

    //   this.productName.map(function (value) {
    //    if(value.id != data.id){
    //     productData.push(data)
    //    }
    //   })

    // }else{
    //   this.productName.map(function (value) {
    //     if(value.id == data.id){
    //       productData.splice(value)
    //     }
    //    })
    // }
    // console.log(productData)
    data.selected = !data.selected;
    if (!data.selected) {
      data['error'] = false;
    }
    this.order.selectedProductsError = false;
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  changeProductPrice(data: any): void {
    if (data.selected && data.quantity != '') {
      data['error'] = false;
    }
  }
  createOrderConfirm(stepper: any) {
    //console.log('testing')
    this.confirOrderLoad = true;
    this.createbtnDisabled = true;
    let clientAddress = this.order.clientAddress.filter(function (value) {
      if (value['selected']) {
        return true;
      }
      return false;
    });
    let companyAddress = this.order.companyAddress.filter(function (value) {
      if (value['selected']) {
        return true;
      }
      return false;
    });

    let notifyAddress = [];
    if(this.order.notifyAddress.length) {
      notifyAddress = this.order.notifyAddress.filter(function (value) {
        if (value['selected']) {
          return true;
        }
        return false;
      });
    }
    let selectedProducts = [];
    if (this.uploads.length) {
      this.order.filename = this.uploads[0].filename;
      this.order.original_name = this.uploads[0].original_name;
      this.order.src_name = this.uploads[0].source_path;
    }
    this.order.selectedProducts.map(function (value) {
      //products_types_id,quantity,price
      selectedProducts.push({ price: value.price, quantity: value.quantity, products_types_id: value.id });
    });
    const orderDeliveryDate = moment(this.productsForm.controls.delivery_date.value).toLocaleString();
     if (this.productsForm.controls.po_date.value){
       this.poDate = moment(this.productsForm.controls.po_date.value).toLocaleString();
    }else{
       this.poDate = "";
    }
    // console.log(orderDeliveryDate)
    this.OrdersService
      .createOrder({
        organization_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : this.clientsForm.controls.client.value),
        org_address_bill_id: companyAddress[0].org_address_bill_id,
        company_shipping_id: clientAddress[0].org_address_bill_id,
        org_notify_addr_id: notifyAddress.length ? notifyAddress[0].org_address_bill_id : null,
        special_instructions: this.productsForm.controls.special_instructions.value,
        po_nbr: this.productsForm.controls.po_no.value,
        po_date: this.poDate,
        email: this.productsForm.controls.email.value,
        phone: this.productsForm.controls.phone.value,
        ext: this.productsForm.controls.ext.value,
        kindAttn: this.productsForm.controls.kindAttn.value,
        delivery_date: orderDeliveryDate,
        productArr: selectedProducts,
        filename: this.order.filename,
        original_name: this.order.original_name,
        src_name: this.order.src_name,
        //currency_id: currency_id
      }).then(response => {
       // console.log(response,'tet')
        if (response.result.success) {
          this.confirOrderLoad = false;
          this.createbtnDisabled = false;
          this.dialogRef.close({ success: true, response: response.result.data.id });
          let toast
          //  let data = response.result.data.totalordersDt;
          // let reloadPage = true;
          // this.router.events.subscribe(val => {
          //   if (val instanceof NavigationStart) {
          //     if (val['url'].match('orders')) {console.log('reload')
          //     console.log(val['url'])
          //       reloadPage = false;
          //       const config = this.router.config.map((route) => Object.assign({}, route));
          //       this.router.resetConfig(config);
          //       this.router.navigate([val['url']]);
          //     }
          //   }
          // });
          // if(reloadPage){console.log('navigate')
          //   this.router.navigate(['/orders']);
          // }
        }
      });


  }
  selectCompanyAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.companyAddress.map(function (value) {
      if (data.id != value.id) {
        value['selected'] = false;
      }
      addressList.push(value);
    });
    this.order.companyAddress = addressList;
  }

  selectClientAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.clientAddress.map(function (value) {
      if (data.id != value.id) {
        value['selected'] = false;
      }
      addressList.push(value);
    });
    this.order.clientAddress = addressList;
  }

  selectNotifyAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.notifyAddress.map(function (value) {
      if (data.id != value.id) {
        value['selected'] = false;
      }
      addressList.push(value);
    });
    this.order.notifyAddress = addressList;
  }

  selectAddress(data: any, list: any, type: any): void {
    // console.log(data)
    if (!data.selected) {
      if (type == 1) {
        // console.log('comingggggggg')
        this.shippingAddressDetails.address1 = data.address1,
          this.shippingAddressDetails.address2 = data.address2,
          this.shippingAddressDetails.country = data.country,
          this.shippingAddressDetails.state = data.state,
          this.shippingAddressDetails.postal_code = data.postal_code

      } else if(type == 2) {
        // console.log('comingggggggg')
        this.billingAddressDetails.address1 = data.address1,
          this.billingAddressDetails.address2 = data.address2,
          this.billingAddressDetails.country = data.country,
          this.billingAddressDetails.state = data.state,
          this.billingAddressDetails.postal_code = data.postal_code

      } else {
          this.notifyAddressDetails.address1 = data.address1,
          this.notifyAddressDetails.address2 = data.address2,
          this.notifyAddressDetails.country = data.country,
          this.notifyAddressDetails.state = data.state,
          this.notifyAddressDetails.postal_code = data.postal_code
      }
    }
    data.selected = !data.selected;
    list.map(function (value) {
      if (data.id != value.id) {
        value['selected'] = false;
      }
    });
    if (type == '1') {
      this.order.selectedShippingError = false;
    } else if (type == '2') {
      this.order.selectedBillingError = false;
    } else {
      this.order.selectedNotifyError = false;
    }
  }

  goToNext(stepper: MatStepper) {
    stepper.next();
    if (stepper['_selectedIndex'] == 1) {
      this.getProducts();
      this.getContacts();
    } else if (stepper['_selectedIndex'] == 2) {
      this.getAddress();
    }
  }

  goToPrev(stepper: MatStepper) {
    if (stepper['_selectedIndex'] == 3) {
      this.stepper.selectedIndex = 1;
    }else{
      stepper.previous();
    }
  }

  phoneNumberValidation(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    event.preventDefault();
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getOrganizations(this.param);
  }
}

  public clear() {
    this.modelData.id = null;
    this.modelData.name = null;
    this.searchCtrl.setValue(null);
    this.param.search = '';
    this.getOrganizations(this.param);
}

  selectionChange(data) {
    // console.log(data)
    this.modelData.id = data.id;
    this.modelData.name = data.name;
    this.getOrganizations(this.param);
    this.searchCtrl.setValue(data.name);
  }

  public selectedClients(event:any,param:any) {
    this.showError = false;
    this.selectAuto = true;
    this.param.search = event.target.value;
    console.log(this.param)
    this.organizationsService
      .getOrganizationsList(this.param)
      .then(response => {
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          this.order.organizations = response.result.data.organization;
        }
        if(response.result.data.count == 0) {
          this.showError = true;
          this.errormessage = 'No Client Data Found';
        }
      });
  }

}

