import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators,FormArray } from '@angular/forms';
import { LeadsService } from '../leads.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { AdminService } from '../../services/admin.service';
import { Subject } from 'rxjs';
import { Param } from '../../custom-format/param';
import { QuotePreviewComponent } from '../quote-preview/quote-preview.component';
import { MyErrorStateMatcher } from '../lead.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import { Images } from '../../images/images.module';
import { SnakbarService } from '../../services/snakbar.service';
import { ReactiveFormsModule} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
  formGroup: FormGroup;
  @Input()  name:string
  @Output() public messageEvent =  
 new EventEmitter<{name:boolean, age:boolean}>(); 
  public overViewData: any;
  checkedArr = [];
  minDate = new Date();
  checkedArrShip =[];
  billAddressView:any;
  shipAddressView:any;
  public formvalid =false;
  public showDelete =false;
 public totalAmount:any
  leadId: any;
  serverError;
  enblebtn =true;
  show =true;
  leadAssineId:any;
  slectedProducts:any = [];
  slectedProductsNew:[];
  public products=[];
  public productsobj ={};
  contactSearchSpinner = false;
  timeOutRef:any;
  assigneeList = new Subject<any>();
  editId:any;
  submitForm =false;
  public images = Images;
  public checking:any;
public input3:any
public billCheck:any
public shipCheck:any
public checkDisbleShip:any
public checkDisbleBill:any
public delEnable =false
public submitted =false
  constructor(private service: LeadsService,  private snackbar: SnakbarService,private activateRoute: ActivatedRoute, private fb: FormBuilder,private dialog: MatDialog,private adminService: AdminService,private route: Router ) { }

  ngOnInit(): void {
    this.generateDetailsForm()
    


    this.activateRoute.params.subscribe((res: any) => {
      if (res) {
        this.leadId = res.id;
        
        this.getDetailView(res.id);
        this.getAssigneeList(res.id)
      }
    })
  }
  updateChecked(groupname, event) {
    if (event.checked) {
      this.delEnable =true
      this.checkDisbleShip =true
        this.checkedArr.push(groupname.id)
        // this.showError = false;
        this.billCheck = groupname.id
        
    } else {
      this.delEnable =false
        let index = this.checkedArr.indexOf(groupname.id)
        if (index > -1) {
            this.checkedArr.splice(index, 1)
        }
        this.checkDisbleShip =false

        this.billCheck = '';

    }
    console.log(this.checkedArr,this.billCheck)

}
updateCheckedShip(groupnames, event) {
  if (event.checked) {
    this.delEnable =true
    this.checkDisbleBill =true
      this.checkedArr.push(groupnames.id)
      // this.showError = false;
      this.shipCheck = groupnames.id
      
  } else {
    this.delEnable =false
      let index = this.checkedArr.indexOf(groupnames.id)
      if (index > -1) {
          this.checkedArr.splice(index, 1)
      }
      this.checkDisbleBill =false
      this.shipCheck = '';

  }
  console.log(this.checkedArr,this.shipCheck)

}
  getDetailView(param): void {
    this.service
      .getDetailView(param)
      .then(response => {
        if (response.result.success) {
          this.overViewData = response.result.data.data[0];
          
          this.billAddressView = this.overViewData.billAddress
          console.log(this.overViewData.id,this.billAddressView )
          this.shipAddressView = this.overViewData.shipAddress
          this.leadAssineId =this.overViewData.id
          this.service.postDetailsData(this.overViewData);
          this.catchOverviewData();
        }
        else;
      })
      .catch(error => console.log(error))
  }
  
  catchOverviewData() {
    this.service.getDetailsData().subscribe(res => {
      if (res) {
        this.overViewData = res;
      }
    })
  }
 
  generateDetailsForm(){
    console.log(this.slectedProducts)
    
    this.formGroup = new FormBuilder().group({
      attention_name: new FormControl(null , [Validators.required]),
      contact_number: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.required,Validators.pattern(
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      )]),
      quote_validity: new FormControl(null, [Validators.required]),
      special_instructions:'',
      entity_type: 1,
     attention_to:0,      
      //entity_id: this.data.leadId
      ////input:new FormControl(null , [Validators.required]),
       required:new FormControl(null),
       requiredShip:new FormControl(null),
        input2:new FormControl(null),
    });
    
  }
  saveQuote(form:any){
  //  console.log(form)
    let data = []
   this.submitted =true
   this.submitForm =true;
   if(form.valid ){
     this.formvalid = true
   }else{
     return false
   }
  
   let dateVal = moment(form.value. quote_validity).format('YYYY-MM-DD');
   console.log(dateVal)
   form.patchValue({
    quote_validity: dateVal
  })
    this.slectedProducts.forEach((ele:any)=>{
      console.log(ele)
   if(ele.quantity){
     this.checking = true
   }else{
    this.checking = false
   }

      data.push({ products_id:ele.id,
      quantity:ele.quantity,
      unit_price:ele.price})
      // Reqparams.quantity=,
    })
    if(this.checking ){
      this.checking = true
    }else{
      return false
    }
// console.log(this.slectedProducts.push(data))
//this.products.push(this.slectedProducts)
let param = form.value
param.products = data;
param.entity_id=this.leadAssineId ;
param.id =  this.editId;
param.address_id = this.shipCheck?this.shipCheck:this.billCheck;
const returnedTarget = Object.assign(param );
let toast: object;
this.service
      .createQuote(returnedTarget)
      .then(response => {
        if (response.result.success) {
         // this.overViewData = response.result.data.data[0];
         // this.service.postDetailsData(this.overViewData);
         // this.catchOverviewData();
         this.editId = response.result.data
         let dialogRef = this.dialog.open(QuotePreviewComponent, {
          panelClass: 'alert-dialog',
          width: '1200px',
          data: {
            data: response.result.data
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log(result.id)
          }
        });
      
        }
         else{
           this.serverError = response.result.message ? response.result.message : 'Something went wrong';
           toast = { msg: this.serverError, status: 'error' };
           this.snackbar.showSnackBar(toast);
         };
      })
      .catch(error => console.log(error))
  }
  cancel() {
   console.log(1)
   this.messageEvent.emit({name:false,age:false})
  }
  
  addProduct(data = {}) {
    let param =[]
    // this.getProducts(param);
    // console.log(data);
    let selectedProducts = this.slectedProducts.map(x => x.id);
    let dialogRef = this.dialog.open(AddProductComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
      data: {
        //leadId: this.overViewData.id,
        selectedProducts:selectedProducts,
        // ...data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(this.slectedProducts,"befre",result)
      if (result) {
        // console.log(result)
        this.slectedProducts = [...this.slectedProducts,...result];
      }
      console.log(this.slectedProducts,"after") 
    });
  }
  getProducts(param: object): void {
   
    this.adminService
      .getProductsList(param)
      .then(response => {
       
        
        if(response.result.success){
         
          let data = response.result.data.ProductRange;
          let categoryData = response.result.data.categoryDt;
         
         
        }
       
      })
      .catch(error => console.log(error))
  }
  // getAssigneeList(e?) {
  //   clearTimeout(this.timeOutRef);
  //   this.contactSearchSpinner = true;
  //   this.timeOutRef = setTimeout(() => { console.log(e)
  //     let body = {search : e? e.target.value : ''};
  //     this.service.getAssigneeList( this.leadId).then(res => {
  //       if (res.result.success) {
  //         this.assigneeList = res.result.data;
  //       } else {
  //         this.assigneeList.next([])
  //       }
  //       this.contactSearchSpinner = false;
  //     });
  //   }, 1000);
  // }
  getAssigneeList(param:any) {
    this.service.getAssigneeList(this.leadId).then(res => {
      if (res.result.success) {
        this.assigneeList = res.result.data;
      }
    });
  }
  
  contactSelected(e){
    // console.log(e.value,e.value.contact_details)
    this.formGroup.patchValue({
      contact_number: e.value.contact_details,
      // attention_name:e.value.contact_name,
      email: e.value.email,
      attention_to: e.value.id

     
    })
  }
  
  quantyChange(e,j,p){
    //console.log(e.target.value,j,p,"qty")
    const val = e.target.value
    //console.log(p[j].priceRange)
    this.slectedProducts[j].quantity = val;
    if(this.slectedProducts[j].quantity && val != 0){
      this.enblebtn = false;
    }else{
      this.enblebtn = true;
    }
   
    if(p[j].priceRange.length){
      if(val<25){
       // this.slectedProducts 
       
        this.slectedProducts[j].price = p[j].priceRange[0].range_price 
        this.slectedProducts[j].amount = val * p[j].priceRange[0].range_price
  
      }else if(val>25 && val<100) {
        this.slectedProducts[j].price = p[j].priceRange[1].range_price 
        this.slectedProducts[j].amount = val * p[j].priceRange[1].range_price
      }else if(val>=100 && val<500){
        this.slectedProducts[j].price = p[j].priceRange[2].range_price 
        this.slectedProducts[j].amount = val * p[j].priceRange[2].range_price
      }else if(val>=500 && val<1000){
        this.slectedProducts[j].price = p[j].priceRange[3].range_price 
        this.slectedProducts[j].amount = val * p[j].priceRange[3].range_price

      }else if(val>=1000){
        this.slectedProducts[j].price = p[j].priceRange[4].range_price
        this.slectedProducts[j].amount = val * p[j].priceRange[4].range_price 
      }
      //if(val){
      // let datas =[]
      //   this.slectedProducts.forEach((ele:any)=>{
      //     console.log(ele)
      //     this.checking =ele.price
    
      //     datas.push({ products_id:ele.id,
      //     quantity:ele.quantity,
      //     unit_price:ele.price})
      //    Reqparams.quantity=,
      //   })
      //   console.log(datas)
      //   datas.forEach((ele:any,i)=>{
      //    this.input3 = ele.unit_price
      //    Reqparams.quantity=,
      //   })
     /// }
//            this.slectedProducts.forEach((ele:any,i:any)=>{       console.log(ele)
//       this.checking =ele.price

     this.formGroup.patchValue({
  input2 : this.slectedProducts[j].price
         
 })

//     })
    
     //let  total =0
    //  this.checking = this.slectedProducts[j].price
      console.log(this.slectedProducts[j].amount ,this.slectedProducts[j].price)
    }
    else{
      if(val){
       // console.log(val)
        this.slectedProducts[j].amount = val * this.slectedProducts[j].price
      }
      
    }
    let total = 0;
    for (var i = 0; i < this.slectedProducts.length; i++) {
        if (this.slectedProducts[i].amount) {
            total += this.slectedProducts[i].amount;
            this.slectedProducts[i].totalamount = total;
            console.log(total)
            this.totalAmount =total
        }
    }
  }
  priceChange(e,j,p,form){
   // console.log(e.target.value,j,p,"qty")
    const val = e.target.value
    if(val && val != 0 ){
      this.enblebtn = false;
    }else{
      this.enblebtn = true;
    }
    this.slectedProducts[j].amount = val*this.slectedProducts[j].quantity
//console.log(this.slectedProducts[j].amount)
    let total = 0;
    for (var i = 0; i < this.slectedProducts.length; i++) {
        if (this.slectedProducts[i].amount) {
            total += this.slectedProducts[i].amount;
            this.slectedProducts[i].totalamount = total;
            //console.log(total)
            this.totalAmount =total
        }
    }
  }
  deleteProduct(product,i){
   // console.log(this.slectedProducts)
   this.enblebtn = false;
  this.slectedProducts.splice(i,1)
 
  }
   

  backQuote(){
   // console.log(this.overViewData)
    this.messageEvent.emit({name:false,age:false})

    // this.route.navigate(['/messages'])
    // this.show =false    
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  allowOnlyNum(evt, i, value): boolean {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    //allowing backspace
    if (charCode == 8) {
      return true;
    }

    // if (this.storesCustomAttributesData[i].selected_value && this.storesCustomAttributesData[i].selected_value.length > 0) {
    //   let l = parseInt(this.storesCustomAttributesData[i].selected_value);
    //   if (evt.srcElement.value && evt.srcElement.value.split(".")[1] && evt.srcElement.value.split(".")[1].length > l - 1) {
    //     return false;
    //   }
    // }
    //allowing dot(.)
    if (charCode == 110 || charCode == 190) {
      if (this.formGroup.get('input').value[value].indexOf('.') === -1) {
        return true;
      } else {
        return false;
      }
    }
    if (charCode >= 96 && charCode < 107) {
      return true;
    } else if (charCode > 96 && charCode < 107) {
      return true;
    }
    else if (evt.shiftKey || (charCode > 31 && (charCode < 48 || charCode > 57))) {
      return false;
    }
    return true;
  }
}
