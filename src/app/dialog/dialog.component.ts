import { Component, OnInit, Input, Output, EventEmitter,Inject, ViewChild } from '@angular/core';
import {MatInputModule, MatInput} from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, FormControl,FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { language } from '../language/language.module';
import { SnakbarService } from './../services/snakbar.service';
import { AdminService } from './../services/admin.service';

//services import//
import { OrganizationsService } from '../services/organizations.service';
declare var App: any;
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss','../admin-module/organizations/organizations-contacts/organizations-contacts.component.scss'],
  providers: [OrganizationsService, AdminService]
})
export class DialogComponent implements OnInit {
  @Input() Organization ; 
  @Output() trigger = new EventEmitter<object>();
  @ViewChild('firstname', {static: true}) firstname:any;
  detailsForm: FormGroup;
  public language = language;
  currencyX: any[];
  countries:any;
  states: any[];
  status = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];  

  uploads = [];
  pointerEvent: boolean;
  public disabledSave = false;
  uploadError = false;
  sizeError:boolean;
  private imageUploadUrl = App.base_url + 'uploadOrgImage';
	submitCountry = false;
	submitState = false;
	countriesStates: any;
  public selectedtype;
  public hasDropZoneOver: boolean = false;
	private websitePattern = /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true
  });
  public showSpinner = false;


  constructor(
    private organizationsService: OrganizationsService,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
		private adminService: AdminService,

     public dialogRef: MatDialogRef<DialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data:MatDialog
  ) {
    this.uploader
    .onBeforeUploadItem = (fileItem: any) => {
      fileItem.formData.push( { 123: 234 } );
    }
    this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
      // this.uploadError = true;
      if(item.size >= options.maxFileSize){
        this.sizeError = true
        this.uploadError = false;
      }else{
        this.uploadError = true;
        this.sizeError = false
      }
     
      
      };
    this.uploader
    .onAfterAddingFile = (item: any) => {
      // this.pointerEvent = true;
    }
    this.uploader
    .onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      let obj = JSON.parse(response);
      if (obj.result.success) {
        this.uploads = [];
        this.uploads.push(obj.result.data);
        this.uploadError = false;
        this.sizeError = false;
      }
    }
  }
  ngOnInit() {
    console.log(this.data,"dialog data")
    this.createForm();
    this.getOrganization();
    this.getOrganizationDetails();
    this.selectedtype = this.status[0].param;
    this.firstname.nativeElement.focus();
  }

  getOrganization(): void {
    let param = {
      page: '',
      perPage: '',
      sort: 'ASC',
      search: ''
    }
    this.organizationsService
      .getOrganizationsList(param)
      .then(response => {
        if (response.result.success) {
          // this.currencyX = response.result.data.currencyDt;
          // console.log(response.result.data)
         
        }
      })
      .catch(error => console.log(error))
  }
  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then(response => {
        if (response.result.success) {
            this.countries =  response.result.data.countries;
            this.countries.unshift({id: 'add_country', name: 'Add Country'});
            this.currencyX = response.result.data.currency;
        }
      })
      .catch(error => console.log(error))
  }


  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.uploads.splice(index, 1);
    this.sizeError = false;
  }
  
  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }
  
  fileDrop(event): void {
    // console.log(this.uploader.queue)
    // console.log(event)
  }
  
  fileSelected(event): void {
    // console.log(123)
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  public noZeroValidator(control: FormControl) {
    //console.log(control.value)
    if(control.value == 0){
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      company_name: [null, [Validators.required , this.noWhitespaceValidator , this.noZeroValidator]],
      website: [null, [Validators.pattern(this.websitePattern)]],
      status: [null, Validators.required],
      currency_id:[null, Validators.required],
      country_id:[null,Validators.required],
      addCountry: ''
    });
  }

 
  addOrg(form: any): void {
    // console.log(form)
    let toast: object;
    this.detailsForm.get('company_name').markAsTouched();
    // this.detailsForm.get('website').markAsTouched();
    this.detailsForm.get('status').markAsTouched();
    this.detailsForm.get('currency_id').markAsTouched();
    this.detailsForm.get('country_id').markAsTouched();
      if (!form.valid) return;
     
      let param = Object.assign({}, form.value);
      // param['type'] = 'client';
      if(this.uploads.length){
        param.filename = this.uploads[0].filename;
        param.original_name = this.uploads[0].original_name;
        param.src_name = this.uploads[0].source_path;
      }
      this.disabledSave = true;
      this.showSpinner = true;
      this.organizationsService
      .addorganizations(param)
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          this.uploadError = false;
          this.sizeError = false;
          this.showSpinner = false;
          this.Organization = response.result.data[0];
          this.trigger.closed = true;
          this.dialogRef.close({success: true, response:this.Organization});
        } else {
          toast = { msg: response.result.message, status: 'error' };
          this.snackbar.showSnackBar(toast);
        }
      })
  }
  cancelOrg() {
    this.sizeError = false;
    this.uploadError = false;
  }

  onCountryChange(event): void {
    console.log(event)
		if (event.value == 'add_country') {
			this.submitCountry = true;
		} else {
			this.submitCountry = false;
		}
	}

  addCountry(country: any) {
		if (country.value.addCountry) {
			this.adminService
				.addCountry({ name: country.value.addCountry })
				.then(response => {
					if (response.result.success) {
						this.submitState = true;
						this.submitCountry = false;
						this.getOrganizationDetails();
						this.detailsForm.patchValue({
							country_id: response.result.data.id,
						});
					}

				});
		}
	}

}
