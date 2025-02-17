import { Component,OnInit,Output, EventEmitter, Input, OnChanges, SimpleChange, Inject } from '@angular/core';
import { language } from '../../language/language.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import * as _ from 'lodash';
import { map } from 'rxjs/operators';


import { Param } from '../../custom-format/param';
import { AdminService } from '../../services/admin.service';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { matDatepickerAnimations } from '@angular/material/datepicker';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  animations: [
    trigger('AdminListAnimate', [
        transition(':enter', [
            style({ transform: 'translateX(-100px)', opacity: 0 }),
            animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
        ])
    ])
]
})


export class AddProductComponent implements OnInit {


  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noProducts: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  productLIst: Array<any> = [];
  categoryData: Array<any> = [];
  priceData: Array<any> = [];
  selectedProducts=[]
  productLIstnew =[]
  selectedProduct: object;
  public language = language;
  public open = false;
  productId: any;
  checknow:any
  private listActive = true;
  public data
  @Input() update;
  @Output() trigger = new EventEmitter<object>();
  @Output() getCategory = new EventEmitter<object>();
public addProdt =false
  private param: Param = {
    page: 1,
    perPage: 25,
    sort: 'ASC',
    search: ''
  }
  public params:any
  constructor(private adminService: AdminService, 
       public dialogRef: MatDialogRef<AddProductComponent>,
       @Inject(MAT_DIALOG_DATA) public matData: any,
    ) { 
    
  }

  backToList(){
    this.listActive = false;
  }

  ngOnInit() {
    this.getProducts(this.params);
    
    console.log(this.productLIst)
  }
  

  getProducts(param: object, flag?: string, cb?): void {
     this.params  = Object.assign({quote_product:true}, this.param);
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.adminService
      .getProductsList(this.params)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if(cb) this.searching = false;
        if(response.result.success){
          this.totalCount = response.result.data.count;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
         // if(cb) this.productLIst = [];
          this.data = response.result.data.ProductRange;
          let categoryData = response.result.data.categoryDt;
          this.priceData = response.result.data.RangeDt;
 
          this.data.forEach((temp:any)=>{
           temp.selected = false
               this.productLIst.push(temp);
             
         })
         this.productLIst = this.data
           
            
            if(this.productLIst.length){
            this.noProducts = false;
             }
             if(this.matData && this.matData.selectedProducts.length){
               this.addProdt =true
             }
            // console.log(this.productLIst)
             let array1 = this.productLIst.filter(x => this.matData.selectedProducts.includes(x.id));
            
            
            this.productLIst.forEach((res:any,index)=>{
              array1.forEach((ele:any)=>{
                if(ele.id == res.id){
                  res.selected=true;
                }
              })
            })
            console.log(this.productLIst)  
         
          if(this.totalCount == 0) this.noRecords();
          // else 
          // this.getProduct(this.productLIst[0])
        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }
  
  

  noRecords(): void {
    this.totalPages = 0;
    this.noProducts = true;
    this.productLIst = [];
    this.selectedProduct = {
      
    };
    
  }

  

  getProduct(ev:any,data?: any): void{
  console.log(ev)
    this.noProducts = false;
    if(ev.checked){
     data.selected = true 
     this.addProdt =true 
     
     
        this.productLIst.forEach(function (value,index) {
          if(value.id == data.id){
            value.selected = true
          }  
          });
      
     this.selectedProducts.push(data) 
     console.log( this.productLIst)  
    }else{
      if(!this.selectedProducts.length ){
        this.addProdt =false
      }     
       // this.selectedProducts.map((ele:any,index)=>{
      //   console.log(data,ele,index)
      //   if(ele.id == data.id){
      //     this.selectedProducts.splice(index,1)
      //   }
      // })
      this.selectedProducts.splice(this.selectedProducts.indexOf(data.id),1)
    }
    console.log(this.selectedProducts)
   
    //this.selectedProduct = data;
    
  }
  private timeout;
  searchProducts(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getProducts(this.param, 'search', () => { });
    }, 1000)
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getProducts(this.param, 'pagination');
    }
  }
  cancel() {
    this.dialogRef.close();
this.getProduct(this.param)
  }
  
  saveContact():void{
    console.log(this.matData.selectedProducts)
   if(this.matData && this.matData.selectedProducts.length){
   let array = this.selectedProducts.filter(x => !this.matData.selectedProducts.includes(x.id));
   console.log (this.selectedProducts);
   this.dialogRef.close(array);
   

   } else{
    this.dialogRef.close(this.selectedProducts)

   }
 
   }
   
}

