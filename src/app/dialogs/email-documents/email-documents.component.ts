import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrganizationsService } from '../../services/organizations.service';
import { SnakbarService } from '../../services/snakbar.service';
import { OrdersService } from '../../services/orders.service';
declare var App: any;
@Component({
  selector: 'app-email-documents',
  templateUrl: './email-documents.component.html',
  styleUrls: ['./email-documents.component.scss'],
  providers: [OrganizationsService, OrdersService],
})
export class EmailDocumentsComponent implements OnInit {

  constructor(private fb: FormBuilder, 
    private organizationsService: OrganizationsService, 
    private OrdersService: OrdersService, 
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  checkedInput: boolean;
  private App = App;
  public userDetails: any;
  public documentTypes: Array<any> = [];
  public documentTypesList: Array<any> = [];
  public selectAll = false;
  public toUsers: Array<any> = [];
  fetchingData = true;
  public emptyData: boolean = true;
  public confirEmailSending: boolean = false;
  public emailSentSuccessMsg: boolean = false;
  public emailSendSubmit: boolean = false;
  public showAttachmentsError : boolean = false;
  activeState: boolean;

  ngOnInit() {
    this.getDocumentTypesData();
    this.getClientsEmailList();
    this.userDetails = App.user_details;
    this.activeState = false;
    this.documentTypes.map(function (value) {
      if (value.selected) {
        this.selectAll = true;
      }
    });
  }
  emailDocuments = this.fb.group({
    toUser: [[], Validators.required],
    ccUser: [[]],
    emailSubject: ["", Validators.required],
    emailBody: ["", Validators.required],
    // emailAttachments: [[], Validators.required]
  });
  documentTypeChange(data: any): void {
    data.selected = !data.selected;
    this.checkedInput = true;
    this.activeState = true;
    this.checkSelectAll();
  }
  documentTypeAllChange(data: any): void {
    this.selectAll = !data;
    this.documentTypes.map(function (value) {
      value.selected = !data;
    });

    this.checkedInput = true;
    this.activeState = true;
  }
  getDocumentTypesData(): void {
    this.activeState = false;
      this.fetchingData = true;
      this.activeState = false;
      this.organizationsService
        .getDocumentsList({ order_id: this.data.order_id })
        .then(response => {
          this.emptyData = false;
          this.fetchingData = false;
          if (response.result.success) {
            this.documentTypesList = response.result.data.SelectedData;
            if (this.data.other_docs.length){
              this.documentTypesList.push({ id: 99, name: "Other Documents", selected: false });
            }
            this.documentTypesList.push({ id: 100, name: "Bank Details", selected: false }, { id: 101, name: "Purchase Order", selected: false } );
            this.documentTypes = this.documentTypesList;
            this.checkSelectAll();
          }
        })
        .catch(error => console.log(error))
  }
  checkSelectAll(): void {
    let selectAll = [];
    selectAll = this.documentTypes.filter(function (value) {
      if (value.selected) {
        return true;
      }
      return false;
    });
    if (selectAll.length == this.documentTypes.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  getClientsEmailList(){
    this.OrdersService
      .getClientsEmailList({ orders_id: this.data.order_id })
      .then(response => {
        if (response.result.success) {
          this.toUsers = response.result.data.to;
        }
      });
  }
  sendEmailDocs(){
    this.emailDocuments.controls.emailSubject.markAsTouched();
    this.emailDocuments.controls.emailBody.markAsTouched();
    this.emailSendSubmit = true
    let selectedIds = [];
    this.documentTypes.map(function (value, index) {
      if (value.selected) {
        selectedIds.push(value.id);
      }
    });
    if (!selectedIds.length){
      this.showAttachmentsError = true;
    }else{
      this.showAttachmentsError = false;
    }
    const params = { orders_id: this.data.order_id, invoice_id: this.data.invoice_id, to: this.emailDocuments.value.toUser, cc: this.emailDocuments.value.ccUser, subject: this.emailDocuments.value.emailSubject, message: this.emailDocuments.value.emailBody, documentArr: selectedIds }
    if (this.emailDocuments.valid && selectedIds.length){
      this.dialogRef.close();
      let toast: object;
      toast = { msg: 'The documents are being processed, we will notify you once the email has been sent.', status: 'success' };
      this.snackbar.showSnackBar(toast);
      this.OrdersService
        .sendDocumentsMail(params)
        .then(response => {
          // this.confirEmailSending = true;
          if (response.result.success && (response.result.data != null)) {
            toast = { msg: 'Email has been sent successfully.', status: 'success' };
            this.snackbar.showSnackBar(toast);
          } else if (response.result.success && (response.result.data == "" || response.result.data == null)) {
            toast = { msg: 'No Documents Found.', status: 'success' };
            this.snackbar.showSnackBar(toast);
          } else {
            toast = { msg: 'Error Sending Email.', status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        });

    }

  }
  checkboxChange(data: any): void {
    data.selected = !data.selected;
  }
  selectState() {
    this.activeState = true;
  }
  

}