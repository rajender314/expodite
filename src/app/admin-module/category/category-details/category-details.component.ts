import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { language } from '../../../language/language.module';
import { ContainerDeleteComponent } from '../../../dialogs/container-delete/container-delete.component';
import { Observable } from 'rxjs/Observable';
import { Images } from '../../../images/images.module';
import { VERSION } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';



import * as _ from 'lodash';

import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.scss'],
  providers: [AdminService, SnakbarService],
  animations: [
      trigger('AdminDetailsAnimate', [
          transition(':enter', [
              style({ transform: 'scale(0.8)', opacity: 0 }),
              animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
      ])
  ]
})
export class CategoryDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() category;
  @Output() trigger = new EventEmitter<object>();

  detailsForm: FormGroup;
  fetchingData: boolean;
  deleteHide:boolean;
  submitcategory:boolean;
  noCategory= true;
  pointerEvent: boolean;
  selectedCategory: any;
  private language = language;
  addCategory = "Add Category"
  private images = Images;
  status = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];  
  public selectedtype;

  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noCategory = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.category != undefined)
    
    if (!_.isEmpty(this.category)) {
this.addCategory = "Update Category"
      this.detailsForm.reset();
      if (this.category.hasOwnProperty('flag')) {
        this.noCategory = true;
        this.deleteHide = true;
        this.selectedCategory = {};
      }
      else{
        this.deleteHide = false;
        this.noCategory = false;
        this.fetchingData = false;
        this.selectedCategory = this.category;
        this.setForm(this.category);
        
      } 

    }
    else {
      this.pointerEvent = false;
      
      this.noCategory = false;
      this.newContainer(true);
    }
  }

  ngOnInit() {

    this.createForm();

  }

  newContainer(flag: boolean): void {
    // console.log(232332)
    this.submitcategory = false;
    this.addCategory = "Add Category";
    this.inputEl?.nativeElement.focus()
    if (flag) 
    // this.detailsForm.reset();
      this.selectedCategory = {};
      this.category = {};
      this.fetchingData = false;
      this.deleteHide = true;
      // 
      this.detailsForm.patchValue({
        name:  "",
        status:  true,
        description: "",
  
      });
      // this.detailsForm.value.name = ''
      // this.selectedtype = this.status[0].param;

  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  public noWhitespaceValidator(control: FormControl) {
    //console.log('fergrege');
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  createForm(): void {
    this.detailsForm = this.fb.group({
      name: [null, [Validators.required , this.noWhitespaceValidator]],
      status: [null, Validators.required],
      description: [null],
      id:""
    });

    // this.detailsForm.patchValue({
     
    //   status: true ,
     

    // });
  }

  cancel(form: any): void {
    this.submitcategory = false;
    form.markAsPristine();
    this.setForm(this.selectedCategory);
  }

  createShipment(form: any): void {
   
    // console.log("coming")
    form.get('name').markAsTouched({ onlySelf: true });
    form.get('status').markAsTouched({ onlySelf: true });
    this.submitcategory = true;
    // form.get('description').markAsTouched({ onlySelf: true });
    let toast: object;
   
    if (!form.valid) return;
   
    let param = Object.assign({}, form.value);
    param.id = this.selectedCategory.id || 0;
    this.adminService
      .addCategory(param)
      .then(response => {
        if (response.result.success) {
          this.noCategory = false;
          this.submitcategory = false;
          form.markAsPristine();
          if (param.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedCategory = response.result.data.categoriesDt[0];
          this.trigger.emit({ flag: param.id, data: this.selectedCategory });
        } else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
  }

  deleteContainer(form: any): void {
    let toast: object;
    let dialogRef = this.dialog.open(ContainerDeleteComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
      // height: '240px',
      data: this.detailsForm.value
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result.success){
    this.adminService
      .deleteContainer({id:this.selectedCategory.id})
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          if (this.selectedCategory.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.trigger.emit({ flag: this.selectedCategory.id, delete: true, data: this.selectedCategory });
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
  
  setForm(data: any): void {
  //  console.log(data)
    this.detailsForm.patchValue({
      name: (data && data.name) ? data.name : "",
      status:  (data) ? data.status : "",
      description: (data && data.description) ? data.description : "",
      id: (data && data.id) ? data.id : ""

    });
  }
}
