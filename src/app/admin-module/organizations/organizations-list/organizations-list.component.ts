import { ContactsViewService } from './../../../services/contacts-view.service';
import { Component, OnInit,Output, EventEmitter, Input, OnChanges, SimpleChange,ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Param } from '../../../custom-format/param';
import { OrganizationsService } from '../../../services/organizations.service';
import { DialogComponent } from  '../../../dialog/dialog.component';
import { SnakbarService } from '../../../services/snakbar.service';
import { language } from '../../../language/language.module';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

declare var App: any;

@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrganizationsService, SnakbarService],
  animations: [
      trigger('clientsAnimate', [
          transition(':enter', [
              style({ transform: 'translateX(-100px)', opacity: 0 }),
              animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
          ])
      ])
  ]
  
})
export class OrganizationsListComponent implements OnInit, OnChanges {

  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noOrganizations: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  organizationsList: Array<any> = [];
  selectedOrganizations: object;
  public language = language;
  public open = false;
  myProfile = true;
  //noRecords = [];

  private userProfileImg: string = App.public_url + 'signatures/assets/images/avatar.png';
  
    @Input() update;
    @Output() trigger = new EventEmitter<object>();
  
    private param: Param = {
      page: 1,
      perPage: 12,
      sort: 'ASC',
      search: ''
    }

  constructor(
    private organizationsService: OrganizationsService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    public contactsViewService: ContactsViewService
    ) { }

  ngOnInit() {
    let profile : boolean;
    this.getOrganizationsList(this.param);
    // console.log(App.user_details.org_id)
    App.user_roles_permissions.map(function (val) {
      if (val.code == 'client_interface') {
          if (val.selected) {
              profile = true
          } else {
              profile = false
          }
      }
  })
  this.myProfile = profile;
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(this.update){
      if(this.update.id){
        this.organizationsList.map(organization => {
          if(organization.id === this.update.id){
            // console.log(this.update);
            organization.name = this.update.result.name;
            organization.attachments_id = this.update.result.attachments_id;
            organization.website = this.update.result.website;
            organization.company_logo = this.update.result.company_logo;
            organization.currency_id = this.update.result.currency_id;
            organization.status = this.update.result.status;
            organization.country_id = this.update.result.country_id;
          }
        })
        this.selectedOrganizations = _.find(this.organizationsList, {id: this.update.id})
      }else{
        this.totalCount = this.totalCount + 1;
        this.organizationsList.unshift(this.update.result);
        this.selectedOrganizations = this.update.result;
      }
    }
  }

  getOrganizationsList(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.organizationsService
      .getOrganizationsList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if(cb) this.searching = false;
        if(response.result.success){
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          this.organizationsList = response.result.data.organization;
          // if(cb) this.organizationsList = [];
          // // here api data should change the params
          // this.organizationsList = response.result.data.organization;
          // data.map(res => {
          //   this.organizationsList.push(res);
          // });
          if(this.totalCount == 0) {
            this.noRecords();
          }
          
          else {
            if(this.contactsViewService.contactRowdata != undefined) {
              const index = _.findIndex(this.organizationsList, { id: this.contactsViewService.contactRowdata['org_id'] });
              this.getOrganization(this.organizationsList[index]);
              this.contactsViewService.contactRowdata = undefined
            } else {
              this.getOrganization(this.organizationsList[0]);
            }
          } 
        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }


  noRecords(): void {
    this.totalPages = 0;
    this.noOrganizations = true;
    this.organizationsList = [];
    this.selectedOrganizations = {};
    this.trigger.emit({flag: 'new'});
  }

 
  getOrganization(data?: any): void{
    this.noOrganizations = false;
    this.selectedOrganizations = data || {};
    // console.log(this.selectedOrganizations)
    this.trigger.emit(this.selectedOrganizations);
  }

  private timeout;
  searchOrganization(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrganizationsList(this.param, 'search', () => { });
    }, 1000)
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getOrganizationsList(this.param, 'pagination');
    }
  }

  addOrganization(): void {
    let toast: object;
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'alert-dialog',
      width: '590px',
      autoFocus: false
      // height: '565px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.success){
        toast = { msg: "Organization saved successfully.", status: "success" };
        this.organizationsList.unshift(result.response);
        this.totalCount = this.totalCount + 1;
        this.getOrganization(result.response);
        this.snackbar.showSnackBar(toast);
        

      }
    });
  }

  loadMore(param) {
    // console.log(param);
    param.search = this.param.search;
    this.getOrganizationsList(param, 'pagination');
  }
}
