import { Component, OnInit,Output, Input,EventEmitter, OnChanges, SimpleChange,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailValidator } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Images } from '../../images/images.module';

import { Observable } from 'rxjs/Observable';
import { language } from '../../language/language.module';
import { InputTrimModule } from 'ng2-trim-directive';

import * as _ from "lodash";

import { Param } from '../../custom-format/param';

import { UsersService } from '../../services/users.service';
import { AdminService } from '../../services/admin.service';
import { SnakbarService } from '../../services/snakbar.service';
import {} from '../../services/snakbar.service';
import { FileUploader } from 'ng2-file-upload';

import { UsersComponent } from '../users.component';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

declare var App: any;

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [UsersService, AdminService, SnakbarService],
  animations: [
      trigger('usersAnimate', [
          transition(':enter', [
              style({ transform: 'scale(0.9)', opacity: 0 }),
              animate('300ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
          ])
      ])
  ]
})
export class UserDetailsComponent implements OnInit, OnChanges {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() userId;
  @Output() UpdateUser = new EventEmitter<object>();
  public language = language;
  public images = Images;
  saveUser = "Add User";
  private usersIcon: string = App.public_url + 'signatures/assets/images/users-icon.svg';
  userForm: FormGroup;
  status = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];
  public selectedtype = false;
  fetchingData: boolean = true;
  noUser: boolean = false;
  selectedUser: any;
  filteredRoles: Observable<any[]>;
  fetchingRoleData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noRoles: boolean;
  userSubmit:boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  uploadError = false;
  rolesList: any[];
  uploads = [];
  currencyX: any[];
  pointerEvent: boolean;
  sizeError:boolean;
  public disableSelect = false;
  public disableEmailField = true;
  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private userService: UsersService,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    private usersComponent: UsersComponent
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
      //this.pointerEvent = true;
  
    }
    
    this.uploader
    .onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      let obj = JSON.parse(response);
      if (obj.result.success) {
        this.uploadError = false;
        this.sizeError = false;
        this.uploads = [];
        this.userForm.get('firstname').markAsTouched({ onlySelf: true });
        this.userForm.markAsDirty();
        this.uploads.push(obj.result.data);
      }
    }
  }

  private imageUploadUrl = App.base_url + 'uploadProfileImage';
  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
public noZeroValidator(control: FormControl) {
	// console.log(control.value)
	if(control.value == 0 ){
	  let isWhitespace = true;
	  let isValid = !isWhitespace;
	  return isValid ? null : { 'whitespace': true };
	}
  }

  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true
  });

  deleteItem(index: number): void {
    this.sizeError = false;
   
    this.uploads.splice(index, 1);
    this.userForm.markAsDirty()
  }
  
  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }
  
  fileDrop(event): void {
  }
  
  fileSelected(event): void {
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(this.userId)
    if (this.userId == 0) {
    
      this.selectedtype = true;
      
    }
    this.uploadError = false;
    this.sizeError = false;
    this.userSubmit = false;
    // this.userForm.markAsUntouched();
    if (this.userId != undefined) {
      // console.log(this.userId)
      this.noUser = false;
      this.userForm.markAsPristine(); // default form prisnstine
      this.fetchingData = true;
      this.disableEmailField = true;
        
      
      if (this.userId == 0) {
        this.newUser(true);
        this.disableSelect = false;
        this.disableEmailField = false;
        return;
      }
      else if (this.userId == -1) {
        this.userId = 0;
        this.noUser = true;
        this.disableEmailField = true;
        this.newUser(false);
        
      }
      this.userService
        .getSelectedUser({ id: this.userId })
        .then(response => {
          this.fetchingData = false;
          
          if (response.result.success) {
            this.selectedUser = response.result.data;
            const index = _.findIndex(this.rolesList, { id: this.selectedUser.roles_id });
            // console.log(index, this.selectedUser.role_name)
            if(index == -1 && (this.selectedUser.role_name != undefined)) {
              this.rolesList.push({id: this.selectedUser.roles_id, name: this.selectedUser.role_name, description: '', status: ''})

            }
            this.setForm(this.selectedUser);
            this.selectedtype = this.selectedUser.status;
          }
        })
        .catch(error => console.log(error));
    } else {
      // console.log(this.userId)
      // this.userForm.value.status = true;
    }
    
  }

  ngOnInit() {
    this.createForm();
    this.getRolesList();
    this.adminService.loggedUserEmail = App.user_details.email;

    
  }

  newUser(flag: boolean): void {
   
    this.saveUser = "Add User"
    if (flag) this.userForm.reset();
    this.selectedUser = {
      firstname:'',
      lastname:'',
      email:'',
      status: true,
      roles_id:''
    };
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.fetchingData = false;
    this.inputEl ? this.inputEl.nativeElement.focus() : '';
    this.uploads = [];
    this.userForm.patchValue({
     
      status: true
    });
  }

  createForm(): void {
    this.userForm = this.fb.group({
      firstname: [null, [Validators.required , this.noWhitespaceValidator, this.noZeroValidator]],
      lastname: [null, [Validators.required , this.noWhitespaceValidator, this.noZeroValidator]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      status: [null, Validators.required],
      roles_id: [null, Validators.required]
    });
    // setTimeout(() => {
    //   this.filteredRoles = this.userForm.controls.roles.valueChanges
    //     .startWith(null)
    //     .map(state => state ? this.onValueChange(state) : this.rolesList.slice());
    // }, 1000);
  }

  onValueChange(name: string) {
    return this.rolesList.filter(role =>
      //role.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
      role.name.indexOf(name) === 0);
  }
  public isOwnerFlag = false;
  setForm(data: any): void {
    // console.log(data.status)
    this.selectedtype = true;
    this.userService.selectedEmail = data.email;
    this.isOwnerFlag = data.is_owner ? data.is_owner : false;
  

    if((this.userService.selectedEmail == this.adminService.loggedUserEmail) || this.isOwnerFlag) {
      this.disableSelect = true;
    } else {
      this.disableSelect = false;

    }
    this.saveUser = "Update User"
    this.userForm.setValue({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      status: data.status,
      roles_id:data.roles_id
    })

   
    // this.selectedtype = data.status;
    this.uploads = [];
    //this.pointerEvent = false;
    if (data.profile_image_url) {
    
      // this.pointerEvent = true;
      let obj = {
        filename: data.profile_image_url,
        source_path: data.profile_image_url,
        original_name: data.profile_image_url
      }
      this.uploads.push(obj);
    }
    // if (data.roles_id) {
    //   setTimeout(() => {
    //     let res = _.find(this.rolesList, { id: data.roles_id });
    //     //this.userForm.controls.roles.setValue(res.name);
    //   })
    // }
  }

  getRolesList() {
      let params = {
        page: '',
        perPage: '',
        sort: 'ASC',
        search: '',
        module : 'users'
      }
      this.adminService
        .getRolesList(params)
        .then(response => {
          if (response.result.success) {
            this.rolesList = response.result.data.roles;
          }
        })
        .catch(error => console.log(error))

  }

  setDirty(): void {
    this.userForm.markAsDirty();
  }

  cancel(form: any): void {
    this.userSubmit = false;
    this.uploadError = false;
    this.sizeError = false;
    form.markAsPristine();
    this.setForm(this.selectedUser);
  }

  submitUser(form: any): void {
    let toast: object;
    this.userSubmit = true;
    if (!form.valid) return;
    let data = Object.assign({}, form.value);
    data.id = this.selectedUser.id || 0;
    if(this.uploads.length){
      data.filename = this.uploads[0].filename;
      data.original_name = this.uploads[0].original_name;
      data.src_name = this.uploads[0].source_path;
    }
    this.fetchingData = true;
    let role = _.find(this.rolesList, { 'name': form.value.roles });
    //data.roles_id = role ? role.id : '';
    this.userService.addUser(data)
      .then(response => {
        if (response.result.success) {
          this.fetchingData = false;
          this.selectedUser = response.result.data;
          form.markAsPristine();
          this.userSubmit = false;
          this.uploadError = false;
          this.sizeError = false;
          this.UpdateUser.emit(this.selectedUser);
          App.loggedAs.profile_image_url = this.selectedUser.profile_image_url;
          if (data.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          if (!data.id) {
            this.usersComponent.usersList.unshift(this.selectedUser);
            this.usersComponent.totalUsers++;
            this.usersComponent.selectUser(this.selectedUser.id);
          }
          /* update toolbar */
          if(App.user_details.id === this.selectedUser.id) Object.assign(App.user_details, this.selectedUser);
        }
        else {
          this.fetchingData = false;

          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error));
  }

  selectUser(id: number): void {
    this.usersComponent.selectUser(id);
  }

  checkModelType(msg: string): object {
    let data;
    switch (msg) {
      case 'reset':
        data = {
          title: 'Reset Password',
          url: 'forgotPassword',
          msg: 'Password Reset link will be sent to <b>\'' + this.selectedUser.email + '\'</b>. Are you sure you want to reset your password?',
          result: this.selectedUser
        }
        break;
    }
    return data;
  }

  openDialog(msg: string): void {
    
    let modelData = this.checkModelType(msg);
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      disableClose: true,
      panelClass: 'alert-dialog',
      width: '600px',
      data: modelData
    });
    
    dialogRef.afterClosed().subscribe(result => {
      // if(result.success) {
        // let toast: object;
        //  toast = { msg: "Reset Password link sent successfully...", status: "success" };
        //   this.snackbar.showSnackBar(toast);
          // console.log(toast)
      // }
     

    });
   
  }

}
