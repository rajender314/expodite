import { ContactsViewService } from './../services/contacts-view.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Param } from '../custom-format/param';
import { language } from '../language/language.module';

import { UsersService } from '../services/users.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
//import { AppComponent } from '../app.component';
import * as _ from 'lodash';

declare var App: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService, Title],
  animations: [
    trigger('usersAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {

  //user_roles_permissions: Object;
  usersList: Array<any> = [];
  totalUsers: number = 0;
  public language = language;
  totalPages: number;
  params: Param = {
    page: 1,
    perPage: 12,
    sort: 'ASC',
    search: ''
  };
  open: boolean = false;
  fetchingData: boolean;
  searching: boolean;
  paginationScroll: boolean;
  noUsers: boolean;
  selectedId: any;
  numbers = [1, 2, 3, 4, 5];
  public minLimit: number;
  public maxLimit: number;
  public active = [];
  public displayRange: number;
  public calculateCount = false;

  constructor(
    private titleService: Title,
    private router: Router,
    public contactsViewService: ContactsViewService,
    private userService: UsersService/*,
  private appComponent: AppComponent*/) { }

  ngOnInit() {
    this.titleService.setTitle(App['company_data'].usersTitle);
    this.getUsers(this.params);
    this.calculateCount = true;

    /*console.log(this.appComponent.user_roles_permissions);
    this.user_roles_permissions = App.user_roles_permissions;
    console.log(this.user_roles_permissions);*/
  }

  getUsers(params, flag?, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    else this.fetchingData = true;
    this.noUsers = false;
    this.userService.getUsersList(params)
      .then(response => {
        this.paginationScroll = false;
        this.fetchingData = false;
        this.searching = false;
        if (response.result.success) {
          this.totalUsers = response.result.data.count;
          //this.totalPages = Math.ceil(Number(this.totalUsers) / this.params.perPage);
          this.totalPages = this.totalUsers
          this.usersList = response.result.data.items;
          // if (cb) this.usersList = [];
          // let data = response.result.data.items;
          // data.map(res => {
          //   this.usersList.push(res);
          // });
          // this.calculatePagesCount();
          if (response.result.data.count == 0) {
            this.noUsersExists();
            this.noUsers = true;
          }
          else {
            if (this.contactsViewService.contactRowdata != undefined) {
              // console.log(this.usersList)
              // console.log(this.contactsViewService.contactRowdata)
              const index = _.findIndex(this.usersList, { id: this.contactsViewService.contactRowdata['id'] });
              // console.log(index)
              // delete params.perPage;
              this.selectUser(this.usersList[index].id);
            } else {
              this.selectUser(this.usersList[0].id);
            }
          }
        }
        else {
          this.noUsersExists();
        }
      })
  }

  noUsersExists(): void {
    this.noUsers = true;
    this.usersList = [];
    this.totalUsers = 0;
    this.selectUser(-1);
  }

  selectUser(id?: number): void {
    this.selectedId = id;
    this.noUsers = false;
  }
  updateData(data: any) {
    // console.log(data)
    if (data.status == undefined) {
      data.status = true;
    }
    if (data.id) {
      this.usersList.map(userName => {
        if (userName.id === data.id) {
          userName.image = data.profile_image_url;
          userName.name = data.name;
          userName.email = data.email;
        }
      }

      )
    }


  }
  private timeout;
  searchUser(val: string, event?: any): void {
    this.params.search = val;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getUsers(this.params, 'search', () => { });
    }, 1000);
  }

  loadMore(params) {
    params.search = this.params.search;
    this.getUsers(params, 'pagination');
  }


  calculatePagesCount() {
    if (this.calculateCount) {
      this.numbers = [];
      // this.pageCount = this.totalCount / this.params.pageSize;
      this.totalPages = Math.ceil(Number(this.totalUsers) / this.params.perPage);
      this.totalPages = Math.ceil(this.totalPages);
      // this.editProgress = false;
      for (let i = 1; i <= this.totalPages; i++) {
        this.numbers.push(i);
        this.active[i] = false;
      }
      this.active[1] = true;
      this.minLimit = 0;
      this.displayRange = 5;
      this.maxLimit = this.minLimit + this.displayRange;
    }
    this.calculateCount = false;
  }


  onScroll(): void {
    // console.log(2)
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      // console.log(25)
      this.params.page++;
      this.getUsers(this.params, 'pagination');
    }
  }

}
