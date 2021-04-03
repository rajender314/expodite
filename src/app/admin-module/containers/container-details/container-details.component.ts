import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { language } from '../../../language/language.module';

import { Observable } from 'rxjs/Observable';



import * as _ from 'lodash';

import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { PermissionsService } from '../../../services/permissions.service';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-container-details',
  templateUrl: './container-details.component.html',
  styleUrls: ['./container-details.component.scss'],
  animations: [
      trigger('AdminDetailsAnimate', [
          transition(':enter', [
              style({ transform: 'scale(0.8)', opacity: 0 }),
              animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
      ])
  ]
})
export class ContainerDetailsComponent implements OnInit {

  @Input() roles;
  @Output() trigger = new EventEmitter<object>();

  detailsForm: FormGroup;
  fetchingData: boolean;
  noRoles: boolean;
  pointerEvent: boolean;
  globalPermissions: any;
  systemPermissions: Array<any> = [];
  rolePermissions: Array<any> = [];
  selectedRoles: any;
  private language = language;

  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService
  ) { }

  

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      this.noRoles = false;
      this.fetchingData = true;
      setTimeout(() => {
        this.fetchingData = false;
      }, 300);
      if (this.roles != undefined)
        if (!_.isEmpty(this.roles)) {
          this.detailsForm.reset();
          if (this.roles.hasOwnProperty('flag')) {
            this.noRoles = true;
            this.selectedRoles= {};
          }
          else this.setForm(this.roles);
          this.adminService
          .getSelectedRole({ id: this.roles.id })
          .then(response => {
            this.fetchingData = false;
            if (response.result.success) {
              this.selectedRoles = response.result.data.role_details;
              this.rolePermissions = response.result.data.role_details.roles_permissions;
              this.setForm(this.selectedRoles);
              this.loadInitials(this.globalPermissions);
            }
          })
          .catch(error => console.log(error));
        }
        else {
          this.pointerEvent = false;
          this.detailsForm.reset();
          this.newRole(true);
        }
  }

  ngOnInit() {
    //this.getRoles();
    this.createForm();
    this.getGlobalPermissions();
  }

  newRole(flag: boolean): void {
    if (flag) this.detailsForm.reset();
    if (flag) setTimeout(() => { this.loadInitials(this.globalPermissions); }, 100);
      this.selectedRoles = {};
      this.roles = {};
      this.rolePermissions = [];
      this.fetchingData = false;

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
    })
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      name: [null, Validators.required],
      description: [null]
    });
  }

  cancel(form: any): void {
    form.markAsPristine();
    this.setForm(this.selectedRoles);
    this.loadInitials(this.globalPermissions);
  }

  createRole(form: any): void {
    let toast: object;
    if (!form.valid) return;
    this.systemPermissions = [];
    this.loadPermissions(this.globalPermissions);
    let param = Object.assign({}, form.value);
    param.id = this.selectedRoles.id || 0;
    param.system_permissions = this.systemPermissions;
    this.adminService
      .addRole(param)
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          if (param.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedRoles = response.result.data;
          this.trigger.emit({ flag: param.id, data: this.selectedRoles });
        }
        else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
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
    this.detailsForm.patchValue({
      name: data.name,
      description: data.description
    });
  }

  getGlobalPermissions() {
    this.adminService
      .getGlobalPermissions()
      .then(response => {
        if (response.result.success) {
          this.globalPermissions = response.result.data.global_system_permissions;
        }
      })
      .catch(error => console.log(error));
  }

}
