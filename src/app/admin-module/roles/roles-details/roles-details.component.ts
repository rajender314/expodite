import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { language } from '../../../language/language.module';
import { Images } from '../../../images/images.module';

import { Observable } from 'rxjs/Observable';



import * as _ from 'lodash';

import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { PermissionsService } from '../../../services/permissions.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-roles-details',
  templateUrl: './roles-details.component.html',
  styleUrls: ['./roles-details.component.scss'],
  providers: [AdminService, SnakbarService, PermissionsService],
  animations: [
    trigger('AdminDetailsAnimate', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class RolesDetailsComponent implements OnInit, OnChanges {
  @ViewChild('myInput') inputEl: ElementRef;
  @Input() roles;
  @Output() trigger = new EventEmitter<object>();
  status: Array<object> = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];
  detailsForm: FormGroup;
  fetchingData: boolean;
  noRoles: boolean;
  pointerEvent: boolean;
  detailsSubmit: boolean;
  globalPermissions: any;
  systemPermissions: Array<any> = [];
  rolePermissions: Array<any> = [];
  selectedRoles: any;
  private language = language;
  public images = Images;
  newRoleAdd = "Add Role";
//   public noWhitespaceValidator(control: FormControl) {
//     console.log('vaewr');
//     let isWhitespace = (control.value || '').trim().length === 0;
//     let isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService
  ) { }



  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noRoles = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    // console.log(this.roles)
    if (this.roles !== undefined) {
      if (!_.isEmpty(this.roles) && this.roles.id != undefined) {
        // console.log(this.roles)

        this.newRoleAdd = "Update Role"
        this.detailsForm.reset();
        if (this.roles.hasOwnProperty('flag')) {
          this.noRoles = true;
          this.selectedRoles = {};
        } else {
          this.setForm(this.roles);
        }
        this.adminService
          .getSelectedRole({ id: this.roles.id })
          .then(response => {
            this.fetchingData = false;
            if (response.result.success) {
              this.selectedRoles = response.result.data.role_details;
              this.adminService.isRoleEditable = response.result.data.role_details.is_admin;
              this.adminService.isClient = response.result.data.role_details.is_client;

              // console.log(this.adminService.isRoleEditable)
              this.rolePermissions = response.result.data.role_details.roles_permissions;
              this.setForm(this.selectedRoles);
              this.loadInitials(this.globalPermissions);
            }
          })
          .catch(error => console.log(error));
      } else {
        this.pointerEvent = false;
        this.detailsForm.reset();
        this.adminService.isRoleEditable = false;
        this.newRole(true);
      }
    }
  }

  ngOnInit() {
    // this.getRoles();
    this.createForm();
    this.getGlobalPermissions();
  }
  

  newRole(flag: boolean): void {
    console.log("role")
    this.newRoleAdd = "Add Role"
    if (flag) { setTimeout(() => { this.loadInitials(this.globalPermissions); }, 100); }
    this.selectedRoles = {};
    this.roles = {};
    this.rolePermissions = [];
    this.fetchingData = false;
     this.inputEl.nativeElement.focus();
    if (flag) {
      //console.log('cmnggg');
      this.detailsForm.reset();
      this.detailsForm.markAsPristine();
      this.detailsForm.markAsUntouched();
    }
    this.detailsForm.patchValue({
     
      status: true
    });

  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }

  loadInitials(data: any): void {
    data.map(child => {
      delete child.permission;
      delete child.checked;
      delete child.selectedValue;
      this.rolePermissions.map(getpermission => {
        if (getpermission.id === child.id) {
          child.checked = _.indexOf(getpermission.permission, 1) > -1 ? true : false;
          child.selectedValue = getpermission.permission[0];
          child.permission = getpermission.permission;
        }
      });
      if (child.children) {
        this.loadInitials(child.children);
      }
    });
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
      description: [null]
    });
  }

  cancel(form: any): void {
    this.detailsSubmit = false;
    form.markAsPristine();
    this.setForm(this.selectedRoles);
    this.loadInitials(this.globalPermissions);
  }

  createRole(form: any): void {
    this.detailsSubmit = true;
    let toast: object;
    if (!form.valid)  {return; }
    this.systemPermissions = [];
    this.loadPermissions(this.globalPermissions);
    const param = Object.assign({}, form.value);
    param.id = this.selectedRoles.id || 0;
    param.system_permissions = this.systemPermissions;
    this.adminService
      .addRole(param)
      .then(response => {
        if (response.result.success) {
          this.detailsSubmit = false;
          if (param.id) {
            toast = { msg: response.result.message, status: 'success' };
          }else {
            toast = { msg: response.result.message, status: 'success' };
          }
          this.selectedRoles = response.result.data;
          this.trigger.emit({ flag: param.id, data: this.selectedRoles });
          form.markAsPristine();
          
        }else {
          toast = { msg: response.result.message, status: 'error' };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error));
  }

  loadPermissions(data: any): void {
    data.map(value => {
      if (_.findIndex(this.systemPermissions, { id: value.id }) === -1 && value.permission) {
        if (value.permission.length) {
          this.systemPermissions.push({ id: value.id, permission: value.permission });
        }
      }
      if (value.children) {
        this.loadPermissions(value.children);
      }
    });
  }

  setForm(data: any): void {
    // console.log(data)
    this.detailsForm.patchValue({
      name: data.name,
      description: data.description,
      status: data.status,
    });
  }

  getGlobalPermissions() {
    this.adminService
      .getGlobalPermissions()
      .then(response => {
        if (response.result.success) {
          this.globalPermissions = response.result.data.global_system_permissions;
          // console.log(response)
        }
      })
      .catch(error => console.log(error));
  }

}
