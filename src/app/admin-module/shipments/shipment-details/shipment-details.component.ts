import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { language } from '../../../language/language.module';
import { ContainerDeleteComponent } from '../../../dialogs/container-delete/container-delete.component';
import { Observable } from 'rxjs/Observable';
import { VERSION } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';



import * as _ from 'lodash';

import { Images } from '../../../images/images.module';
import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.scss'],
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
export class ShipmentDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() shipments;
  @Output() trigger = new EventEmitter<object>();
  activestate: boolean;
  detailsForm: FormGroup;
  fetchingData: boolean;
  deleteHide:boolean;
  submitShipment:boolean;
  noShipments= true;
  pointerEvent: boolean;
  selectedShipment: any;
  private language = language;
  shipmentData = [];
  newShipAdd = "Add Courier";
  public images = Images;
  private websitePattern = /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // if(!this.shipmentData){
    //   this.shipmentData = this.shipments;
    // }
    this.noShipments = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.shipments != undefined)
    
    if (!_.isEmpty(this.shipments)) {
      this.newShipAdd = "Update Courier"
      this.detailsForm.reset();
      if (this.shipments.hasOwnProperty('flag')) {
        this.noShipments = true;
        this.deleteHide = true;
        this.selectedShipment = {};
      }
      else{
        this.deleteHide = false;
        this.noShipments = false;
        this.selectedShipment = this.shipments;

        this.setForm(this.shipments);
        
      } 

    }
    else {
      this.pointerEvent = false;
      
      this.noShipments = false;
      this.newContainer(true);
    }
  }

  ngOnInit() {
    // this.shipmentData = this.shipments;
    this.createForm();
  }

  newContainer(flag: boolean): void {
    this.newShipAdd = "Add Courier"
    this.submitShipment = false;
    this.detailsForm.markAsUntouched();
   // console.log(this.detailsForm);
    if (flag) this.detailsForm.reset();
      this.selectedShipment = {};
      this.shipments = {};
      this.fetchingData = false;
      this.deleteHide = true;
       this.inputEl?.nativeElement.focus()
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  createForm(): void {
    this.detailsForm = this.fb.group({
      name: [null, [Validators.required , this.noWhitespaceValidator]],
      link_url:[null, [Validators.required]],
      id:""
    });
  }

  cancel(form: any): void {
    this.submitShipment = false;
    form.markAsPristine();
    this.setForm(this.selectedShipment);
  }

  createShipment(form: any): void {
    this.submitShipment = true;
    form.get('name').markAsTouched({ onlySelf: true });
    form.get('link_url').markAsTouched({ onlySelf: true });

    let toast: object;
    if (!form.valid) return;
    let param = Object.assign({}, form.value);
    param.id = this.selectedShipment.id || 0;
    this.adminService
      .addShipment(param)
      .then(response => {
        if (response.result.success) {
          this.noShipments = false;
          form.markAsPristine();
          this.submitShipment = false;
          if (param.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedShipment = response.result.data.modeTransportDt[0];
          this.trigger.emit({ flag: param.id, data: this.selectedShipment });
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
      .deleteContainer({id:this.selectedShipment.id})
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          if (this.selectedShipment.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.trigger.emit({ flag: this.selectedShipment.id, delete: true, data: this.selectedShipment });
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
   
    this.detailsForm.patchValue({
      name: (data && data.name) ? data.name : "",
      link_url: (data && data.link_url) ? data.link_url : "",
      id: (data && data.id) ? data.id : ""

    });
  }
  selectDetail() {
    this.activestate = true;
  }
}