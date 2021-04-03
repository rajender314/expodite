import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../../language/language.module';

import { Observable } from 'rxjs/Observable';



import { FileUploader } from 'ng2-file-upload';


import * as _ from 'lodash';

import { UsersService } from '../../../services/users.service';
import { OrganizationsService } from '../../../services/organizations.service';
import { SnakbarService } from '../../../services/snakbar.service';

declare var App: any;

@Component({
  selector: 'app-organizations-details',
  templateUrl: './organizations-details.component.html',
  styleUrls: ['./organizations-details.component.scss'],
  providers: [OrganizationsService]
})
export class OrganizationsDetailsComponent implements OnInit, OnChanges {

  fetchingData: boolean;

  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();

  detailsForm: FormGroup;
  noOrganizations: boolean;
  filteredUsers: Observable<any[]>;
  usersList: any[];
  currency: any[];
  private language = language;
  selectedOrganizations: object;
  uploads = [];
  pointerEvent: boolean;
  social_media: Array<any> = [
    { id: 1, token: '', label: 'Facebook', param: '' },
    { id: 2, token: '', label: 'Instagram', param: '' },
    { id: 3, token: '', label: 'Google AdWords', param: '' },
    { id: 4, token: '', label: 'Pinterest', param: '' },
    { id: 5, token: '', label: 'Twitter', param: '' }
  ]


  private imageUploadUrl = App.base_url + 'uploadProfileImage';

  public hasDropZoneOver: boolean = false;
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true
  });

  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private userService: UsersService,
    private organizationsService: OrganizationsService,
    public dialog: MatDialog

  ) {

    this.uploader
      .onAfterAddingFile = (item: any) => {
        this.pointerEvent = true;
      }
    this.uploader
      .onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        let obj = JSON.parse(response);
        if (obj.result.success) {
          this.uploads.push(obj.result.data);
        }
      }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(OrganizationsDetailsComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  ngOnInit() {

    this.getOrganization();
    this.createForm();
    // this.ListAddress();

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noOrganizations = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.Organization !== undefined) {
      if (!_.isEmpty(this.Organization)) {
        this.detailsForm.reset();
        if (this.Organization.hasOwnProperty('flag')) {
          this.noOrganizations = true;
        } else {
          this.setForm(this.Organization);
        }
      } else {
        this.pointerEvent = false;
        this.detailsForm.reset();
        const obj = {
          social_media: this.social_media
        };
        this.setForm(obj);
        this.uploads = [];
      }
    }

  }


  getOrganization(): void {
    const param = {
      page: '',
      perPage: '',
      sort: 'ASC',
      search: ''
    };
    this.userService
      .getUsersList(param)
      .then(response => {
        if (response.result.success) {
          this.usersList = response.result.data.items;
          this.currency = response.result.data.currencyDt;
        }
      })
      .catch(error => console.log(error))
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      company_name: [null, Validators.required],
      status: [null, Validators.required],
      currency: [null, Validators.required],

    });


  }



  setForm(data: any): void {
    this.detailsForm.patchValue({
      company_name: data.name,
      status: data.status,
      currency: data.currency_id

    });
    if (data.company_logo) {
      this.uploads = [];
      this.pointerEvent = true;
      let obj = {
        filename: 'logo',
        source_path: data.company_logo
      }
      this.uploads.push(obj);
    }
    if (data.users_id) {
      setTimeout(() => {
        let res = _.find(this.usersList, { id: data.users_id });
        this.detailsForm.controls.users.setValue(res.name);
      })
    }
  }


  cancel(form: any): void {
    form.markAsPristine();
    this.setForm(this.Organization);
  }

  onValueChange(name: string) {
    return this.usersList.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }


  createOrganization(form: any): void {
    let toast: object;
    if (!form.valid) return;
    let param = Object.assign({}, form.value);
    param.id = this.Organization.id || 0;
    param.attachments_id = this.Organization.attachments_id || 0;
    //let user = _.find(this.usersList, { 'name': form.value.users });
    //param.users_id = user ? user.id : '';
    if (this.uploads.length) {
      param.filename = this.uploads[0].filename;
      param.original_name = this.uploads[0].original_name;
      param.src_name = this.uploads[0].source_path;
    }

    this.organizationsService
      .addorganizations(param)
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          this.Organization = response.result.data;
          this.trigger.emit({ flag: param.id, data: this.Organization });
          //this.snackbar.showSnackBar(toast);
        }
        else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
  }

  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.uploads.splice(index, 1);
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {
  }

  fileSelected(event): void {
  }




}

