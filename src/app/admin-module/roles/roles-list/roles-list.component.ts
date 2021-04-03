import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChange } from '@angular/core';
import { language } from '../../../language/language.module';

import * as _ from 'lodash';

import { Param } from '../../../custom-format/param';
import { AdminService } from '../../../services/admin.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  providers: [AdminService],
  animations: [
    trigger('AdminListAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class RolesListComponent implements OnInit, OnChanges {

  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noRoles: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  rolesList: Array<any> = [];
  selectedRole: object;
  public language = language;
  public open = false;
  rolesId: any;
  private listActive = true;
  @Input() update;
  @Output() trigger = new EventEmitter<object>();

  private param: Param = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  }
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.getRoles(this.param);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.update) {
      if (this.update.id) {
        let roles = [];
        this.rolesList.map(role => {
          if (role.id === this.update.id) {
            roles.push(this.update.result);
          } else {
            roles.push(role);
          }
        })
        this.rolesList = roles;
        this.selectedRole = _.find(this.rolesList, { id: this.update.id })
      }
      else {
        this.noRoles = false;
        this.totalCount = this.totalCount + 1;
        this.rolesList.unshift(this.update.result);
        this.selectedRole = this.update.result;
      }
      this.trigger.emit(this.selectedRole);
    }
    // this.getRoles(this.param, 'pagination');

  }

  backToList() {
    this.listActive = false;
  }

  getRoles(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.adminService
      .getRolesList(param)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        if (cb) this.searching = false;
        if (response.result.success) {
          this.totalCount = response.result.data.count;
          this.totalPages = Math.ceil(Number(this.totalCount) / this.param.perPage);
          // console.log(this.totalCount)
          this.rolesList = response.result.data.roles;
          // if(cb) this.rolesList = [];
          // let data = response.result.data.roles;
          // data.map(res => {
          //   this.rolesList.push(res);
          // });
          if (this.totalCount == 0) this.noRecords();
          else this.getRole(this.rolesList[0])
        }
        else this.noRecords();
      })
      .catch(error => console.log(error))
  }

  noRecords(): void {
    this.totalPages = 0;
    this.noRoles = true;
    this.rolesList = [];
    this.selectedRole = {};
    this.trigger.emit({ flag: 'new' });
  }

  getRole(data?: any): void {
    this.noRoles = false;
    this.selectedRole = data || {};
    this.trigger.emit(this.selectedRole);
  }

  private timeout;
  searchRoles(search: string, event?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getRoles(this.param, 'search', () => { });
    }, 1000)
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getRoles(this.param, 'pagination');
    }
  }

  loadMore(param) {
    param.search = this.param.search;
    this.getRoles(param, 'pagination');
  }
}
