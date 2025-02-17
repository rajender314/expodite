import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';

import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Images } from '../../../images/images.module';


@Component({
  selector: 'customs-address-list',
  templateUrl: './customs-address-list.component.html',
  styleUrls: ['./customs-address-list.component.scss'],
  animations: [
    trigger('AdminListAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class CustomsAddressListComponent implements OnInit {
  public images = Images;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noContacts: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  contactAddressList: Array<any> = [];
  selectedContact: object;
  public language = language;
  public open = false;
  contactsId: any;
  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();

  private param: Param = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  }
  constructor(private adminService: AdminService) {

  }

  backToList() {
    this.listActive = false;
  }

  ngOnInit() {
    this.getContacts(this.param);
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {

      if (this.update.delete) {
        this.contactAddressList = this.contactAddressList.filter(contactList => {
          if (contactList.id === this.update.id) {
            return false;
          }
          return true;
        });

        if (this.contactAddressList.length) {
          this.noContacts = false;
          this.selectedContact = this.contactAddressList[0];
        } else {
          this.noContacts = true;
          this.selectedContact = {};
        }

      } else if (this.update.id) {
        this.noContacts = false;
        let types = [];
        this.noContacts = false;
        this.contactAddressList.map(contactList => {
          if (contactList.id === this.update.id) {
            types.push(this.update.result);
          } else {
            types.push(contactList);
          }
        });
        this.contactAddressList = types;
        this.selectedContact = _.find(this.contactAddressList, { id: this.update.id })
      } else {
        this.noContacts = false;
        this.totalCount = this.totalCount + 1;
        this.contactAddressList.unshift(this.update.result);
        this.selectedContact = this.update.result;
      }
      this.trigger.emit(this.selectedContact);
    }
    // this.getContacts(this.param, 'pagination');

  }

  getContacts(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.adminService
      .getCustomsAddrList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if (cb) this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.count;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          this.contactAddressList = response.result.data.customsAddrDt;
          // if (cb) this.contactAddressList = [];
          // let data = response.result.data.companyShpAddrDt;
          // data.map(res => {
          //   this.contactAddressList.push(res);
          // });
          if (this.totalCount == 0) this.noRecords();
          else this.getContact(this.contactAddressList[0])
        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noContacts = true;
    this.contactAddressList = [];
    this.selectedContact = {};
    this.trigger.emit({ flag: 'new' });
  }

  getContact(data?: any): void {
    this.noContacts = false;
    this.selectedContact = data || {};

    this.trigger.emit(this.selectedContact);
  }

  private timeout;
  searchContacts(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getContacts(this.param, 'search', () => { });
    }, 1000)
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getContacts(this.param, 'pagination');
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    this.getContacts(param, 'pagination');
  }

}
