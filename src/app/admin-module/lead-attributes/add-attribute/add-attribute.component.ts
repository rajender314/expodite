import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';
import { SnakbarService } from '../../../services/snakbar.service';
import { AdminService } from '../../../services/admin.service';
import { MatInputModule } from '@angular/material/input';
// import {language} from '../../language/language.module'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})


export class AddAttributeComponent implements OnInit {
  private disableField: boolean = false;
  public submitForm : boolean  =false;
  formFields: any;
  public attributeForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddAttributeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
 
  ngOnInit() {
    this.createForm();
    this.getAllFormFieldTypes();
  }
  public noWhitespaceValidator(control: FormControl) {
 
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { 'whitespace': true };
}
  createForm() {
    this.attributeForm = this.formBuilder.group({
      label: [null, [Validators.required , this.noWhitespaceValidator]],
      ui_element_id: [null, Validators.required],
     

    });
    
  }

 

  

  addCustomAttribute(form: any): void {
    this.submitForm = true;
   // console.log( form.valid)
    if (form.valid) {
     
      let data = Object.assign(this.attributeForm.value,{ base_field :false,type:0,entity_type:1});
      
      this.adminService
        .addAttributes(data)
        .then(response => {
          this.submitForm= false;
          if (response.result.success) {
           this.dialogRef.close({ success: true, response: response.result.data })
          } else {
             this.dialogRef.close({ success: false});
          }
        })
    }


  }
  cancel(){
    this.dialogRef.close();
  }
  getAllFormFieldTypes() {
    let param =[]
    this.adminService.allforrmFields(param).then(res => {
      this.formFields = res.result.data.items;
    });
  }
 
}