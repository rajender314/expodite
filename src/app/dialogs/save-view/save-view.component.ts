import { OrdersDuebyClientsComponent } from './../../general-module/reports/orders-dueby-clients/orders-dueby-clients.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { SnakbarService } from '../../services/snakbar.service';
import { ReportsService } from '../../services/reports.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-save-view',
  templateUrl: './save-view.component.html',
  styleUrls: ['./save-view.component.scss']
})
export class SaveViewComponent implements OnInit {
  saveViewForm: FormGroup;
  public inProcess: boolean;
  public submitForm :boolean = false;
  public usersList: any = [];
  public errMessage= '';
  public viewsList =[];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersDuebyClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnakbarService,
    private userService: UsersService,
    private reportsService: ReportsService) { }

  ngOnInit() {
    
    this.createForm();
    this.getUserList();
  }
  createForm(): void {
    this.saveViewForm = this.fb.group({
      name: [null, [Validators.required]],
      share: ['0'],
      shared_users: [null, [Validators.required]]
    });
    this.saveViewForm.get('share').setValidators([Validators.required])
    this.saveViewForm.get('share').updateValueAndValidity();

    this.saveViewForm.get('shared_users').clearValidators();
    this.saveViewForm.get('shared_users').updateValueAndValidity();
  }
  radioChange(event) {
    // console.log(event)
    if(event.value == '0') {
      this.saveViewForm.get('share').setValidators([Validators.required])
      this.saveViewForm.get('share').updateValueAndValidity();

      this.saveViewForm.get('shared_users').clearValidators();
      this.saveViewForm.get('shared_users').updateValueAndValidity();

    } else {
      this.saveViewForm.get('shared_users').setValidators([Validators.required])
      this.saveViewForm.get('shared_users').updateValueAndValidity();

      this.saveViewForm.get('share').clearValidators();
      this.saveViewForm.get('share').updateValueAndValidity();
    }
  }
  getUserList(): void {
    const param = {
      sort: 'ASC',
    };
    this.userService
      .getUserList(param)
      .then(response => {
        if (response.result.success) {
          this.usersList = response.result.data;
          this.showMsg = this.usersList && this.usersList.length ? false : true;

        } 
      })
      .catch(error => console.log(error))
  }
  public showMsg = false;
  saveForm() {
    this.inProcess = true;
    if(this.saveViewForm.value.share == '0') {
        this.saveViewForm.value.shared_users = _.map(this.usersList, 'user_id');
    }
    this.submitForm = true;
    // console.log(this.saveViewForm.value.shared_users)

    const params = {
      view_name: this.saveViewForm.value.name,
      shared_users: this.saveViewForm.value.shared_users,
      applied_filters: this.data.isFiltersApplied ? this.data.filterData : {},
      grid_info: this.data.gridData,
      module: this.data.module
    }
    
    this.reportsService
      .saveViews(params)
      .then(response => {
        this.inProcess = false;
        if (response.result.success) {
         
          this.usersList = response.result.data.items;
          this.showMsg = this.usersList && this.usersList.length ? false : true;
          let currentUserViewId = response.result.data.currentUserViewId;
          setTimeout(() => {
           
           
            this.dialogRef.close(currentUserViewId);
            let toastMsg: object;
            toastMsg = { msg: 'View saved successfully', status: 'success' };
            this.snackbar.showSnackBar(toastMsg);
          }, 200);
           
        } else {
          let toastMsg: object;
            toastMsg = { msg: 'Error while saving View', status: 'error' };
            this.snackbar.showSnackBar(toastMsg);
          this.errMessage = response.result.data.message;
        }
      })
  }
  close() {
    this.dialogRef.close();
  }
  // getViewsList = function() {
  //   const params = {
  //     module: 'All'
  //   }
  //   this.ReportsService.getViewsList(params)
  //     .then(response => {
  //       if (response.result.success) {
  //         this.viewsList = response.result.data;
  //         this.viewsList.forEach(element => {
  //           element.grid_info = JSON.parse(element.grid_info);
  //           element.applied_filters = JSON.parse(element.applied_filters);
  //         });
  //         if(this.viewsList.length) {
  //           this.viewsList.unshift({ view_name: 'Default View', view_id: 1 });
  //         }
          
  //         // console.log(this.viewsList)
  //       } 
  //     })
  // }
}
