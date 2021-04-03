import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter ,Inject,ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { language } from '../../../language/language.module';
import { OrganizationsService } from '../../../services/organizations.service';
import { ProductsDeleteComponent } from '../../../dialogs/products-delete/products-delete.component';
import { VERSION } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Images } from '../../../images/images.module';

import { Observable } from 'rxjs/Observable';



import * as _ from 'lodash';

import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [AdminService, SnakbarService,OrganizationsService],
  animations: [
      trigger('AdminDetailsAnimate', [
          transition(':enter', [
              style({ transform: 'scale(0.8)', opacity: 0 }),
              animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
      ])
  ]
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() productType;
  @Input() categoryDt;
  @Output() trigger = new EventEmitter<object>();
  status: Array<object> = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];  
  
  detailsForm: FormGroup;
  fetchingData: boolean;
  noProducts: boolean;
  deleteHide:boolean;
  pointerEvent: boolean;
  submitProduct: boolean;
  selectedProducts: any;
  uploads = [];
  categoryData = [];
  addProducts = "Add Product";
  public language = language;
  public images = Images;
  public defaultPrice = '0.00';
  public isEditMode = false;
  constructor(
    private organizationsService: OrganizationsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private adminService: AdminService)
    
     { }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      // console.log(this.productType)
      this.getProducts();

       

    if(!this.categoryData){
      this.categoryData = this.categoryDt;
      // console.log(this.categoryDt)
    }
       this.noProducts = false;
      this.fetchingData = true;
      setTimeout(() => {
        this.fetchingData = false;
      }, 300);
      if (this.productType != undefined)

      
      if (!_.isEmpty(this.productType)) {
        
        this.detailsForm.reset();
        if (this.productType.hasOwnProperty('flag')) {
          // console.log(this.productType);
          this.addProducts = "Add Product";
          this.noProducts = true;
          this.deleteHide = true;
          this.selectedProducts = {};
        }
        else{
          // console.log(this.productType);  
          this.deleteHide = false;
          this.addProducts = "Update Product";
          if(!this.productType.id){
            this.addProducts = "Add Product";
          //  this.getProducts();
            // console.log('newww')

            
          }
          this.selectedProducts = _.cloneDeep(this.productType);
          this.submitProduct = false;
          
          this.setForm(this.productType);
          
        } 
      }
      else {
        this.pointerEvent = false;
        
        this.newProduct(true);
      }
  }

  getProducts() {
    let param = {
      page: 1,
      perPage: 5,
      search: "",
      sort: "ASC"
    }
    this.adminService
      .getProductsList(param)
      .then(response => {
        
        if(response.result.success){
         
          this.categoryDt = response.result.data.categoryDt;
          this.categoryDt = this.categoryDt.filter(obj => {
            return obj.status
          })
          if(this.productType != undefined) {
            const index = _.findIndex(this.categoryDt, { id: this.productType['category_id'] });
            if(index == -1 && this.productType.category_id != '') {
              this.categoryDt.push({id: this.productType.category_id, name: this.productType.category_name, status: ''})
  
            }
          }
          // console.log(this.productType.category_id)
         


          // console.log(this.productType)
          // const index = _.findIndex(this.categoryDt, { id: this.selectedUser.roles_id });
          // // console.log(index)
          // if(index == -1) {
          //   this.rolesList.push({id: this.selectedUser.roles_id, name: this.selectedUser.role_name, description: '', status: ''})

          // }
          // console.log(this.categoryDt)
        }
        
      })
      
  }

  ngOnInit() {
    this.categoryData = this.categoryDt
    this.createForm();
   
   
  }
  newProduct(flag: boolean): void {  
      this.inputEl.nativeElement.focus()
    if (flag) this.detailsForm.reset();
      this.selectedProducts = {};
      this.deleteHide = true;
      this.productType = {};
      this.fetchingData = false;

  }
  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  createForm(): void {
    this.detailsForm = this.fb.group({
      name: ["", [Validators.required , this.noWhitespaceValidator]],
      description: "",
      price: [, [Validators.required,Validators.pattern('^[0-9.]*$'), Validators.min(0.0001)]],
      category_id:["", Validators.required],
      unit_weight:["", [Validators.required,Validators.pattern('^[0-9.]*$'), Validators.min(0.0001) ]],
      uom_id: ["", Validators.required],
      status: ["", Validators.required],
    });
  }

  cancel(form: any): void {
    this.submitProduct = false;
    this.selectedProducts = _.cloneDeep(this.productType);
    // console.log(this.selectedProducts)
    form.markAsPristine();
    this.setForm(this.selectedProducts);
  }
  inputEnter($event): void {
    this.detailsForm.markAsDirty();
  }

  updateDefaultPrice(event) {
    // console.log(event)
    // this.selectedProducts.priceRange[0].range_price = event.target.value;
    // console.log(this.productType)

    if(!this.isEditMode) {
      this.selectedProducts.priceRange.map(obj => {
        obj.range_price = event.target.value;
      })
    } else {
      this.productType.priceRange.map((obj, i) => {
        if(obj.range_price == '0') {
          // console.log(i)
          this.selectedProducts.priceRange[i].range_price = event.target.value;
          
        } else {
          console.log(2525)
        }
        // obj.range_price = event.target.value;
      })
    }

   
  }

  createProductType(form: any): void {
    // console.log(form)
    if(form.value.price == '0') {

    }
    let toast: object;
    // console.log('ferger');
    form.get('name').markAsTouched({ onlySelf: true });
    form.get('price').markAsTouched({ onlySelf: true });
    form.get('category_id').markAsTouched({ onlySelf: true });
    form.get('uom_id').markAsTouched({ onlySelf: true });
    form.get('status').markAsTouched({ onlySelf: true });
    form.get('unit_weight').markAsTouched({ onlySelf: true });
    this.submitProduct = true;
    if (!form.valid) {
      return;
    }
    let param = Object.assign({}, form.value);
    param.id = this.selectedProducts.id || 0;
    form.markAsPristine();
    let productIds = [];
    param.priceRange = [];
    // console.log( this.selectedProducts.priceRange)
    this.selectedProducts.priceRange.map(function(value, index){
      param.priceRange.push({id: value.id || value.range_id,price: value.range_price});
    });
   
    this.adminService
      .addProductType(param)
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          this.submitProduct = false;
          if (param.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedProducts = response.result.data.ProductRange[0];
          this.trigger.emit({ flag: param.id, data: this.selectedProducts });      
        }
        else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
  }

  deleteItem(form: any): void {
    let toast: object;
    let dialogRef = this.dialog.open(ProductsDeleteComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
      height: '240px',
      data: this.detailsForm.value
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result.success){
    this.adminService
      .deleteProductType({id:this.selectedProducts.id})
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          if (this.selectedProducts.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          
          this.trigger.emit({ flag: this.selectedProducts.id, delete: true, data: this.selectedProducts });
        }
        else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
    }
  });
   
  }
 
  public catName;
  setForm(data: any): void {
    // console.log(data)
    this.detailsForm.patchValue({
      name: data.name,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
      status: data.status,
      unit_weight: data.unit_weight,
      uom_id: data.uom_id
    });
    this.catName = data.category_name;
    this.selectUnits = data.uom_name;
    // console.log(this.catName)
    this.getUomData();
    if(data.id == '') {
      this.isEditMode = false;
      this.selectedProducts.priceRange.map(obj => {
        obj.range_price = 0;
      })
      this.selectUnits = this.selectedProducts.priceRange[0].uom_name;
      // console.log(      this.selectedProducts.priceRange)

    } else {
      this.defaultPrice = data.price;
      this.isEditMode = true

      const index = _.findIndex(this.categoryDt, { name: data.category_name });
      // console.log(      this.selectedProducts.priceRange
      //   )
      // if(index > -1) {
      //  this.catName = this.categoryDt[index].name;
      // }
      // console.log(this.catName)
      // if(this.catName == undefined) {
      //   this.categoryDt.push({id: data.category_id, name:  data.category_name, status: data.status}) 

      // }


      
    }

    this.showUnitWeight = (data.uom_id == 5 || data.uom_id == 6) ? true : false;
  }
  public uomList = [];
  public selectUnits = '';
  getUomData() {
    let param = {
      module: 'products'
     
    }
    this.adminService
      .getUomData(param)
      .then(response => {
        
        if(response.result.success){
         this.uomList = response.result.data;
        
        }
        
      })
      
  }
  public showUnitWeight = false;
  selectType(event) {
    // console.log(event)
    if(event.value == 5 || event.value == 6) {
      this.showUnitWeight = true;
      this.detailsForm.get('unit_weight').setValidators([Validators.required, Validators.pattern('^[0-9.]*$'), Validators.min(0.0001)])
      this.detailsForm.get('unit_weight').updateValueAndValidity();
    } else {
      this.showUnitWeight = false;
      this.detailsForm.get('unit_weight').clearValidators();
      this.detailsForm.get('unit_weight').updateValueAndValidity();
    }
   
   
    const index = _.findIndex(this.uomList, { id: event.value });
    // console.log(index)
    this.selectUnits = this.uomList[index].name;
    // console.log( this.selectUnits)

  }



}
