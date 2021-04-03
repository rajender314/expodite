import { AdminService } from './../../services/admin.service';
import { Param } from './../../custom-format/param';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
// import {language} from '../../language/language.module'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _ from 'lodash';
import { InventoryService } from '../../services/inventory.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
import * as moment from 'moment';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.scss'],
  providers: [InventoryService]
})
export class AddInventoryComponent implements OnInit {
  private disableField: boolean = false;
  public submitForm : boolean  =false;
  public InventoryForm: FormGroup;
  maxDate = new FormControl(new Date());
  minDate = new Date();
  public batchServerError: string = '';
  private param: Param = {
    page: 1,
    perPage: 25,
    sort: 'ASC',
    search: ''
  }

  public maxDate1 = {
   
    expiry_date: '',
  
  };
  public selectedtype;
  public minDate1 = {
    start_date: new Date(),
    expiry_date : new Date()
  }

  public prefillExpData;

  constructor(
    private formBuilder: FormBuilder,
    private InventoryService: InventoryService,
    public dialog: MatDialog,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { dialogRef.disableClose = true;}

  ngOnInit() {
    this.createForm();
    this.prefillExpData = moment().add(1, 'years')['_d'];
    // console.log(this.prefillExpData)
    if (this.data.hasOwnProperty('fieldsData')) {
      if(Object.keys(this.data.fieldsData).length){
        this.disableField = true;
        this.setForm(this.data.fieldsData);
      } else this.disableField = false;
    }
    // console.log(this.data)
    this.getProducts();
    if(this.data.statusList && this.data.statusList.length) {
      this.data.statusList = this.data.statusList.filter(obj => {
        return obj.name != "Exhausted";
      })
    }

    // this.showProdDrpdown = this.data.fieldsData.title == "Merge Batch" ? true : false;

    if(this.data.fieldsData.title == "Merge Batch") {
      this.InventoryForm.get('product_types_id').clearValidators();
      this.InventoryForm.get('product_types_id').updateValueAndValidity();
    } else {
      this.InventoryForm.get('product_types_id').setValidators([Validators.required])
      this.InventoryForm.get('product_types_id').updateValueAndValidity();
    }

    this.selectedtype = this.data.statusList[0].id;
  }
  public noWhitespaceValidator(control: FormControl) {
 
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { 'whitespace': true };

  
}
  createForm() {
    this.InventoryForm = this.formBuilder.group({
      batch_nbr: [null, [Validators.required , this.noWhitespaceValidator]],
      tot_qty: [null, [Validators.required,Validators.min(1)]],
      category_id: [null, Validators.required],
      product_types_id: [null, Validators.required],
      mfd_date: [new Date(), Validators.required],
      exp_date: [null, Validators.required],
      batch_status_id: [null, Validators.required],

      mergeIds: [null],
      special_instructions: [null],

    });
    this.InventoryForm.get('batch_nbr').valueChanges.subscribe(val => {
      this.batchServerError = '';
    });
  }
  public showExpDatePicker = false;
  selectManufacringDate(event) {
    // console.log(event.value)
    this.showExpDatePicker = true;
   this.minDate1.expiry_date = event.value;
    this.prefillExpData = moment(event.value).add(1, 'years')['_d']
  }

  setForm(data): void {
    // console.log(123)
    this.InventoryForm.patchValue({
      category_id: data.categoryId,
      tot_qty: data.totQty,
      mergeIds: data.mergeIds,
    });
    if (this.disableField) {
      this.InventoryForm.controls['category_id'].disable();
      this.InventoryForm.controls['tot_qty'].disable();
    }
  }
  selectedDate(event, value): void {
    // console.log(123)
  }

  clearServerError(): void{
    // console.log(123)
    this.batchServerError = '';
  }
  public showProdError = false;
  public showSpinner = false;
  public disabledSave = false;
  addInventory(form: any): void {
    // console.log(form)
    
    this.submitForm = true;
    this.InventoryForm.get('batch_nbr').markAsTouched({ onlySelf: true });
    this.InventoryForm.get('tot_qty').markAsTouched({ onlySelf: true});
    this.InventoryForm.get('category_id').markAsTouched({ onlySelf: true });
    this.InventoryForm.get('mfd_date').markAsTouched({ onlySelf: true });
    this.InventoryForm.get('product_types_id').markAsTouched({ onlySelf: true });
    this.InventoryForm.get('exp_date').markAsTouched({ onlySelf: true });
    this.InventoryForm.get('batch_status_id').markAsTouched({ onlySelf: true });
    if(form.value.product_types_id != undefined 
      ) {
      this.showProdError = false;
    } else {
      this.showProdError = true;
      return
    }
    // console.log(this.showProdError)
    if (form.valid) {
      let data = Object.assign(this.InventoryForm.value);
      this.showSpinner = true;
      this.disabledSave = true;

      if(this.disableField){
        data.category_id = this.data.fieldsData.categoryId
        data.tot_qty = this.data.fieldsData.totQty
      }
      data.product_types_id = this.arr;
      // console.log(data)
      // return
      this.InventoryService
        .addBatch(data)
        .then(response => {
          this.submitForm = false;
          if (response.result.success) {
            let flag = this.data.hasOwnProperty('fieldsData') ? true : false;
            this.dialogRef.close({ success: true, response: response.result.data, flag: flag })
            this.showSpinner = false;
            this.disabledSave = false;
          } else {
            this.batchServerError = response.result.data;
            // this.dialogRef.close({ success: false});
          }
        })
    }


  }
  public categoryData = [];
  public productsList = [];
  public selectedProduct;
  getProducts(): void {
  
    this.adminService
      .getProductsList(this.param)
      .then(response => {
       
          // this.productLIst = response.result.data.ProductRange;
          // if(cb) this.productLIst = [];
          // let data = response.result.data.ProductRange;
          this.productsList = response.result.data.ProductRange;

          if(this.data.fieldsData && this.data.fieldsData['title'] == "Merge Batch") {
            //this.filterProdList = response.result.data.ProductTypeDt;
            this.filterProdList = response.result.data.ProductRange;

            // this.filterProdList = this.filterProdList.filter(obj => {
            //   return obj.category_id == this.data.fieldsData['categoryId']; 
            // })
            this.filterProdList = this.productsList.filter(obj => {
              return obj.category_id == this.data.fieldsData['categoryId'] && obj.status
            })
          }
          this.categoryData = response.result.data.categoryDt;
          this.categoryData = this.categoryData.filter(obj => {
            return obj.status
          })
          // console.log(this.productsList)
         
      })
      .catch(error => console.log(error))
  }
  public filterProdList = [];
  public showProdDrpdown = false;
  public noProductsFound = false;
  selectType(event) {
    // console.log(event)
    this.showProdDrpdown = true;
    this.arr = [];
    // const index = _.findIndex(this.productsList, { category_id: event.value });

   this.filterProdList = this.productsList.filter(obj => {
      return obj.category_id == event.value && obj.status
    })

    if(this.filterProdList.length) {
      this.noProductsFound = false;
      
    } else {
      this.noProductsFound = true;
      this.showProdError = false
    }

  // this.selectedProduct = this.productsList[index].category_id;
  // console.log(this.filterProdList)


  }
  public arr = []
  public arr2 = []

  selectProduct(event) {
    // console.log(event)
    this.arr = [];

    this.arr.push(event.value);
    this.showProdError = false;
    // console.log(this.arr)

  
  // console.log( this.removeDuplicates(this.arr))

  }

  // removeDuplicates(array) {
  //   return array.filter((value, index) => {
  //     array.indexOf(value) === index;
  //   });
  // }


  

  openCalendar(picker: MatDatepicker<Date>) {
    // console.log(picker)
    picker.open();
  }

  dateValueChange(event) {
    // console.log(event)
  }
}

